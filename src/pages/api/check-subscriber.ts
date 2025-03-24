import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
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

export async function GET({ cookies }) {
  try {
    const auth = getAuth();
    const sessionCookie = cookies.get('session')?.value;

    if (!sessionCookie) {
      console.log('No session cookie');
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    const user = await auth.getUser(decodedCookie.uid);

    if (!user || !user.email) {
      console.log('No user or no email');
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    console.log('Email del usuario autenticado:', user.email);

    // Aquí buscas el usuario en MailerLite
    const response = await mailerlite.subscribers.find(user.email);

    console.log('Respuesta de MailerLite:', response.data);

    return new Response(
      JSON.stringify({
        authenticated: true,
        subscriber: response.data,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en check-subscriber:', error);
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
