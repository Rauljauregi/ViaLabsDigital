import type { APIRoute } from 'astro';
import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getUserFromFirestore } from '../../../utils/getUserFromFirestore';

// Firebase initialization safeguard
let appInstance;
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
  appInstance = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  appInstance = getApp();
}

async function createSubscriberOnMailerLite(email: string) {
  const now = new Date();
  const format = (n: number) => String(n).padStart(2, '0');
  const formattedDate = `${now.getFullYear()}-${format(now.getMonth() + 1)}-${format(now.getDate())} ${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`;

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAILERLITE_CONNECT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      status: 'unconfirmed',
      subscribed_at: formattedDate,
      groups: ['101178350423246269'], // Reemplaza con tu ID de grupo real
      fields: {
        name: email.split('@')[0],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('❌ Error al crear suscriptor en MailerLite:', error);
    return null;
  }

  const result = await response.json();
  console.log('✅ Suscriptor creado/actualizado en MailerLite:', result.data);
  return result.data;
}

export const GET: APIRoute = async ({ request }) => {
  const auth = getAuth(appInstance);
  const db = getFirestore();
  const usersRef = db.collection('users');

  const email = request.headers.get('Authorization');

  if (!email) {
    console.error('❌ No email provided in Authorization header');
    return new Response('No email provided', { status: 400 });
  }

  try {
    const querySnapshot = await getUserFromFirestore(email);
    let token = '';

    if (querySnapshot.empty) {
      console.log(`⚠️ No user found with email: ${email}. Creating new user.`);

      const newUserRef = await usersRef.add({ email });
      console.log('✅ User registered in Firestore with ID:', newUserRef.id);

      await createSubscriberOnMailerLite(email);

      try {
        const newAuthUser = await auth.createUser({
          uid: newUserRef.id,
          email,
        });
        console.log('✅ User registered in Firebase Auth:', newAuthUser.uid);

        token = await auth.createCustomToken(newAuthUser.uid);
      } catch (authError) {
        console.error('❌ Error creating user in Firebase Auth:', authError);
        return new Response('Error creating user in Auth', { status: 500 });
      }
    } else {
      const userDoc = querySnapshot.docs[0];
      console.log('✅ User found in Firestore with ID:', userDoc.id);

      try {
        const firebaseUser = await auth.getUser(userDoc.id);
        console.log('✅ User found in Firebase Auth:', firebaseUser.uid);

        token = await auth.createCustomToken(firebaseUser.uid);
      } catch (getUserError) {
        console.error('❌ User not found in Firebase Auth. Attempting to create.', getUserError);

        try {
          const newAuthUser = await auth.createUser({
            uid: userDoc.id,
            email,
          });
          console.log('✅ User created in Firebase Auth:', newAuthUser.uid);

          token = await auth.createCustomToken(newAuthUser.uid);
        } catch (authError) {
          console.error('❌ Failed to create user in Firebase Auth:', authError);
          return new Response('Error creating user in Auth', { status: 500 });
        }
      }
    }

    console.log('✅ Custom token generated:', token);
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error in getCustomToken:', error);
    return new Response('Unexpected error', { status: 500 });
  }
};
