import type { APIRoute } from 'astro';
import { app } from '../../../firebase/server';
import { getAuth } from 'firebase-admin/auth';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);
  const confirmation = request.headers.get('Confirmation');
  const location = request.headers.get('Location') || '/';

  /* Obtener el token desde los headers */
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!idToken) {
    return new Response('No token found', { status: 401 });
  }

  /* Verificar el idToken */
  try {
    await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error('Token inválido:', error);
    return new Response('Invalid token', { status: 401 });
  }

  /* Crear y setear la cookie de sesión */
  const fiveDays = 60 * 60 * 24 * 5 * 1000; // 5 días en milisegundos
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: fiveDays,
  });

  cookies.set('session', sessionCookie, {
    path: '/',
    httpOnly: true,
    secure: true, // IMPORTANTE en producción (HTTPS)
    sameSite: 'strict',
    maxAge: fiveDays / 1000, // en segundos
  });

  console.log('✅ Session cookie seteada correctamente');

  if (location) {
    if (confirmation === 'needed') {
      return redirect(`${location}?confirmation=needed`);
    } else if (confirmation === 'success') {
      return redirect(`${location}?confirmation=success`);
    }
    return redirect(location);
  }

  return redirect('/');
};
