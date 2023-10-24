import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getUserFromFirestore } from "../../../utils/getUserFromFirestore";

export const GET: APIRoute = async ({ request }) => {
	const auth = getAuth(app);

   const email = request.headers.get('Authorization');

   const querySnapshot = await getUserFromFirestore(email);
   let token = ''
   if (querySnapshot.empty) {
      /* TRY REGISTRATION */
      console.log('No matching user on get')
   } else {
      const userDoc = querySnapshot.docs[0]
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
