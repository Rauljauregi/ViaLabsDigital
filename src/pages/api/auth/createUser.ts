import type { APIRoute } from 'astro';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import MailerLite from '@mailerlite/mailerlite-nodejs';

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API || '',
});

function getCurrentDateTime(): string {
  const now = new Date();
  const format = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${format(now.getMonth() + 1)}-${format(now.getDate())} ${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`;
}

async function createSubscriberOnMailerLite(email: string) {
  const formattedDate = getCurrentDateTime();
  const params = {
    email,
    status: 'unconfirmed',
    groups: ['101178350423246269'],
    subscribed_at: formattedDate,
  };

  try {
    const res = await mailerlite.subscribers.createOrUpdate(params);
    console.log('✅ Suscriptor creado en MailerLite:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ Error al crear suscriptor en MailerLite:', error?.response?.data || error);
    return null;
  }
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth();
  const db = getFirestore();
  const usersRef = db.collection('users');

  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  const location = formData.get('location')?.toString() || '/';

  if (!email) return new Response('Missing email', { status: 400 });

  let uid = '';

  try {
    // ¿Usuario ya existe?
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      const newUserRef = usersRef.doc();
      await newUserRef.set({ email });
      uid = newUserRef.id;
      console.log('✅ Nuevo usuario creado en Firestore con UID:', uid);

      // Crear también en Firebase Auth
      try {
        await auth.createUser({ uid, email });
        console.log('✅ Usuario creado en Firebase Auth');
      } catch (err) {
        console.warn('⚠️ Usuario ya existía en Auth o error al crear:', err);
      }

      // Añadir a MailerLite
      await createSubscriberOnMailerLite(email);
    } else {
      uid = snapshot.docs[0].id;
      console.log('ℹ️ Usuario ya existe en Firestore con UID:', uid);
    }

    // Generar token personalizado
    const token = await auth.createCustomToken(uid);
    console.log('✅ Token generado');
    return redirect(`/register?customToken=${token}&location=${location}`);

  } catch (err) {
    console.error('❌ Error en POST /api/users:', err);
    return new Response('Internal server error', { status: 500 });
  }
};
