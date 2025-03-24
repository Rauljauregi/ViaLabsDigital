import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import MailerLite from '@mailerlite/mailerlite-nodejs';

export async function GET({ cookies }) {
  try {
    // Inicializamos Firebase SOLO si no hay apps inicializadas
    if (!getApps().length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('✅ Firebase inicializado');
    }

    const auth = getAuth(); // Usamos el app inicializado por defecto
    const sessionCookie = cookies.get('session')?.value;

    if (!sessionCookie) {
      console.log('❌ No session cookie');
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    const user = await auth.getUser(decodedCookie.uid);

    if (!user || !user.email) {
      console.log('❌ No user or no email');
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    console.log('✅ Email del usuario autenticado:', user.email);

    const mailerlite = new MailerLite({
      api_key: process.env.MAILERLITE_API || '',
    });

    // Busca al suscriptor en MailerLite
    const response = await mailerlite.subscribers.get({
      email: user.email,
    });

    console.log('✅ Respuesta de MailerLite:', response.data);

    return new Response(
      JSON.stringify({
        authenticated: true,
        subscriber: response.data,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error en check-subscriber:', error);
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
