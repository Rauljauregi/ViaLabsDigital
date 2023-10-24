import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from "firebase-admin/firestore";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	const auth = getAuth(app);

   const db = getFirestore(app)
   const usersRef = db.collection('users')
   const mail = request.headers.get('Authorization')

   const querySnapshot = await usersRef.where('email', '==', mail).get()
   let token = ''
   if (querySnapshot.empty) {
      /* TRY REGISTRATION */
      console.log('No matching user')
   } else {
      const userDoc = querySnapshot.docs[0]
      const userData = userDoc.data()
      console.log('User ID:', userDoc.id, 'Email:', userData.email)
      try {
         await auth
            .createCustomToken(userDoc.id)
            .then((customToken) => {
               token = customToken
            })
            .catch((error) => {
               console.log('Error creating custom token:', error)
            })
      } catch (error) {
         return new Response('Invalid token', { status: 401 })
      }
   }

	return new Response(JSON.stringify({token: token}));
}
