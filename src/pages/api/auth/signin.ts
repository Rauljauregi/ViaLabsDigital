import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	const auth = getAuth(app)
	const confirmation = request.headers.get('Confirmation');
	const location = request.headers.get('Location') || '/'

	/* Get token from request headers */
	const idToken = request.headers.get('Authorization')?.split('Bearer ')[1]
	if (!idToken) {
		return new Response('No token found', { status: 401 })
	}

	/* Verify id token */
	try {
		await auth.verifyIdToken(idToken);
	} catch (error) {
		return new Response('Invalid token', { status: 401 })
	}

	/* Create and set session cookie */
	const fiveDays = 60 * 60 * 24 * 14 * 1000
	const sessionCookie = await auth.createSessionCookie(idToken, {
		expiresIn: fiveDays
	})

	cookies.set('session', sessionCookie, {
		path: '/'
	})

	if(location){
		if(confirmation === 'needed') {
			return redirect(`${location}?confirmation=needed`)
		} else if (confirmation === 'success') {
			return redirect(`${location}?confirmation=success`)
		}
		return redirect(location)
	}
	return redirect('/')

}
