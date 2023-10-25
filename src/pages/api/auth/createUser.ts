import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	const auth = getAuth(app)

	const db = getFirestore(app)
	const usersRef = db.collection('users')
	const url = new URL(request.url)
	const email = url.searchParams.get('email')

	const querySnapshot = await usersRef.where('email', '==', email).get()
	let token = ''
	if (querySnapshot.empty) {
		/* TRY REGISTRATION */
		try {
			await usersRef.add({
            email
			})
		} catch (error) {
			return new Response('Something went wrong', {
				status: 500
			})
		}
      /* GETTING CUSTOM TOKEN */
      try {
         const fetchToken = await fetch(`${url.origin}/api/auth/getCustomToken`, {
            method: 'GET',
            headers: {
               Authorization: `${email}`
         }});
   
         const customToken = await fetchToken.json();
         return redirect(`/register?customToken=${customToken.token}&email=${email}`);
      }catch(err){
         console.log("Error to Sign in with custom token :", err);
      }
	} else {
      try {
         const fetchToken = await fetch(`${url.origin}/api/auth/getCustomToken`, {
            method: 'GET',
            headers: {
               Authorization: `${email}`
         }});
   
         const customToken = await fetchToken.json();
         return redirect(`/register?customTokenAlreadyPresent=${customToken.token}&email=${email}`);
      }catch(err){
         console.log("Error to Sign in with custom token :", err);
      }
   }

	return redirect('/')
}

