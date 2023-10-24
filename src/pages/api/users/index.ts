import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getFirestore } from 'firebase-admin/firestore'

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
	const email = formData.get('email')?.toString()

	if (!email) {
		return new Response('Missing email', {
			status: 400
		});
	}
	try {
		const db = getFirestore(app)
		const usersRef = db.collection('users');

      const existingUser = await usersRef.where('email', '==', email).get();

      if (!existingUser.empty) {
			return redirect('/');
		}


		await usersRef.add({
			email
		});
	} catch (error) {
		return new Response('Something went wrong', {
			status: 500
		})
	}
	return redirect('/');
}
