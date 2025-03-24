import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

// Inicializamos Firebase si no está hecho
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function GET({ cookies }: { cookies: { get: (name: string) => { value?: string } | undefined } }) {
  try {
    const auth = getAuth();
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

    console.log('✅ Usuario autenticado:', user.email);

    // Aquí llamamos a la API REST de MailerLite manualmente porque el SDK no tiene el método que queremos
    const mailerliteApiKey = process.env.MAILERLITE_API;

    const apiUrl = `https://api.mailerlite.com/api/v2/subscribers/${encodeURIComponent(user.email)}`;

    const mailerResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': mailerliteApiKey || ''
      }
    });

    if (!mailerResponse.ok) {
      console.log(`❌ No se encontró el suscriptor en MailerLite (${mailerResponse.status})`);
      return new Response(JSON.stringify({
        authenticated: true,
        subscriber: null
      }), { status: 200 });
    }

    const subscriberData = await mailerResponse.json();

    console.log('✅ Suscriptor encontrado en MailerLite:', subscriberData);

    return new Response(
      JSON.stringify({
        authenticated: true,
        subscriber: subscriberData
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error en check-subscriber:', error);
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
