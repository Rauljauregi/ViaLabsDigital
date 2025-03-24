import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import MailerLite from '@mailerlite/mailerlite-nodejs';

// Inicializar Firebase Admin solo si no está ya inicializado
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Inicializar MailerLite
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

    // Buscar al usuario en MailerLite por email (según la versión del SDK puede variar)
    let response;
    try {
      response = await mailerlite.subscribers.get({ email: user.email });
      console.log('Respuesta de MailerLite:', response.data);
    } catch (error) {
      console.error('No se encontró el suscriptor en MailerLite:', error);
      return new Response(JSON.stringify({
        authenticated: true,
        subscriber: null
      }), { status: 200 });
    }

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
