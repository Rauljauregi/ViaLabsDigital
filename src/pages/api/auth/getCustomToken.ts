import type { APIRoute } from 'astro';
import { app } from '../../../firebase/server';
import { getAuth } from 'firebase-admin/auth';
import { getUserFromFirestore } from '../../../utils/getUserFromFirestore';
import { getFirestore } from 'firebase-admin/firestore';

export const GET: APIRoute = async ({ request }) => {
  const auth = getAuth(app);
  const db = getFirestore(app);
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

      // También registramos el usuario en Firebase Auth si no existe
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
        // Confirmamos que el usuario existe en Firebase Auth
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
    return new Response(JSON.stringify({ token }), { status: 200 });

  } catch (error) {
    console.error('❌ Unexpected error in getCustomToken:', error);
    return new Response('Unexpected error', { status: 500 });
  }
};
