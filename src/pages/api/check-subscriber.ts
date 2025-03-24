import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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
    const db = getFirestore();

    const sessionCookie = cookies.get('session')?.value;

    if (!sessionCookie) {
      console.log('❌ No session cookie');
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    // ✅ Verificamos la session cookie
    const decodedCookie = await auth.verifySessionCookie(sessionCookie);

    console.log('✅ Session verificada:', decodedCookie);

    // ✅ Buscamos al usuario en Firestore (en lugar de Firebase Auth)
    const userRef = db.collection('users').doc(decodedCookie.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      console.log('❌ No user found in Firestore con UID:', decodedCookie.uid);
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const userData = userSnap.data();

    if (!userData || !userData.email) {
      console.log('❌ No email encontrado en Firestore para UID:', decodedCookie.uid);
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const userEmail = userData.email;

    console.log('✅ Email del usuario autenticado desde Firestore:', userEmail);

    // ✅ Buscamos el usuario en MailerLite
    let response;
    try {
      response = await mailerlite.subscribers.get({ email: userEmail });
      console.log('✅ Respuesta de MailerLite:', response.data);
    } catch (error) {
      console.error('⚠️ No se encontró el suscriptor en MailerLite:', error);
      return new Response(
        JSON.stringify({
          authenticated: true,
          subscriber: null
        }),
        { status: 200 }
      );
    }

    // ✅ Devolvemos la respuesta exitosa
    return new Response(
      JSON.stringify({
        authenticated: true,
        subscriber: response.data
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error general en check-subscriber:', error);
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
