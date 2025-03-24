import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ Inicializar Firebase Admin solo si no está ya inicializado
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// ✅ MailerLite Connect API Key (debería ser algo como `mlc_...`)
const MAILERLITE_API_KEY = process.env.MAILERLITE_CONNECT_API_KEY!;
const MAILERLITE_BASE_URL = 'https://connect.mailerlite.com/api/subscribers';

export async function GET({ cookies }: { cookies: { get: (name: string) => { value?: string } | undefined } }) {
  try {
    const auth = getAuth();
    const db = getFirestore();

    // ✅ 1. Recuperar la session cookie
    const sessionCookie = cookies.get('session')?.value;

    if (!sessionCookie) {
      console.log('❌ No session cookie');
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    // ✅ 2. Verificar la cookie y obtener el UID
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    console.log('✅ Session verificada. UID:', decodedCookie.uid);

    // ✅ 3. Consultar Firestore para obtener el email del usuario
    const userRef = db.collection('users').doc(decodedCookie.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      console.log(`❌ Usuario con UID ${decodedCookie.uid} no encontrado en Firestore`);
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const userData = userSnap.data();

    if (!userData?.email) {
      console.log(`❌ El usuario con UID ${decodedCookie.uid} no tiene email en Firestore`);
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const userEmail = userData.email;
    console.log('✅ Email obtenido de Firestore:', userEmail);

    // ✅ 4. Buscar el suscriptor en MailerLite usando el email
    let subscriberResponse;
    try {
      const res = await fetch(`${MAILERLITE_BASE_URL}/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 404) {
        console.log(`⚠️ El suscriptor ${userEmail} no está en MailerLite`);
        return new Response(
          JSON.stringify({
            authenticated: true,
            subscriber: null
          }),
          { status: 200 }
        );
      }

      if (!res.ok) {
        console.error(`❌ Error al consultar MailerLite: ${res.statusText}`);
        return new Response(JSON.stringify({ authenticated: false }), { status: 500 });
      }

      subscriberResponse = await res.json();
      console.log('✅ Suscriptor encontrado en MailerLite:', subscriberResponse.data);

    } catch (error) {
      console.error('❌ Error consultando MailerLite:', error);
      return new Response(JSON.stringify({ authenticated: false }), { status: 500 });
    }

    // ✅ 5. Devolvemos el suscriptor encontrado
    return new Response(
      JSON.stringify({
        authenticated: true,
        subscriber: subscriberResponse.data
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error general en check-subscriber:', error);
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
