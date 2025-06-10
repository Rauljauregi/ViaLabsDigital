import type { APIRoute } from 'astro';
import { app } from '../../../firebase/server';
import { getAuth } from 'firebase-admin/auth';


export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);
  const confirmation = request.headers.get('Confirmation');
  let location = request.headers.get('Location') || '/';

  // ✅ Codificamos correctamente la URL para evitar errores en Vercel
  try {
    location = encodeURI(decodeURIComponent(location));
  } catch {
    location = '/';
  }

  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!idToken) return new Response('No token found', { status: 400 });

  try {
    await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error('❌ Token inválido:', error);
    return new Response('Invalid token', { status: 401 });
  }

  const fiveDays = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: fiveDays });

  cookies.set('session', sessionCookie, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: fiveDays / 1000,
  });

  console.log('✅ Session cookie seteada correctamente');

  if (confirmation === 'needed') return redirect(`${location}?confirmation=needed`);
  if (confirmation === 'success') return redirect(`${location}?confirmation=success`);
  return redirect(location);
};
