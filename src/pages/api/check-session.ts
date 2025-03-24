import { getAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY!);
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function GET({ cookies }) {
  try {
    const auth = getAuth();
    const sessionCookie = cookies.get('session')?.value;
    if (!sessionCookie) {
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
    }

    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    const user = await auth.getUser(decodedCookie.uid);

    return new Response(JSON.stringify({
      authenticated: true,
      email: user.email,
    }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 });
  }
}
