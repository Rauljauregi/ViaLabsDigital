import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore' // For ECMAScript (ESM)
import MailerLite from '@mailerlite/mailerlite-nodejs'
import { getUserFromFirestore } from 'src/utils/getUserFromFirestore'

const mailerLiteApiKey: string = process.env.MAILERLITE_API || 'default_api_key'
const mailerlite = new MailerLite({
	api_key: mailerLiteApiKey
})

async function createCustomToken(userId: string): Promise<string> {
   const auth = getAuth(app);
   try {
      const customToken = await auth.createCustomToken(userId);
      return customToken;
   } catch (error) {
      console.log('Error creating custom token:', error);
      throw new Error('Failed to create custom token');
   }
}

async function getCustomToken(email: string): Promise<string> {
   const querySnapshot = await getUserFromFirestore(email);
   if (querySnapshot.empty) {
      throw new Error('User not found');
   }
   const userDoc = querySnapshot.docs[0];
   const customToken = await createCustomToken(userDoc.id);
   return customToken;
}

function getCurrentDateTime(): string {
   const now = new Date()
   const year = now.getFullYear()
   const month = String(now.getMonth() + 1).padStart(2, '0')
   const day = String(now.getDate()).padStart(2, '0')
   const hours = String(now.getHours()).padStart(2, '0')
   const minutes = String(now.getMinutes()).padStart(2, '0')
   const seconds = String(now.getSeconds()).padStart(2, '0')
   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

async function createSubscriberOnMailerLite(email: string) {
   const formattedDate: string = getCurrentDateTime();

	const defineStatus: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk' | undefined =
		'unconfirmed'

	const params = {
		email: email,
		status: defineStatus,
		groups: ['101178350423246269'],
		subscribed_at: formattedDate
	}

	mailerlite.subscribers
		.createOrUpdate(params)
		.then((response) => {
			console.log('Registered on MailerLite', response.data)
			return response.data
		})
		.catch((error) => {
			if (error.response) console.log('ERROR!', error.response.data)
			return error.response
		})
}

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	const auth = getAuth(app)
	const db = getFirestore(app)
	const usersRef = db.collection('users')
	const url = new URL(request.url)
	const email = url.searchParams.get('email')

	if (email) {
		try {
			const querySnapshot = await usersRef.where('email', '==', email).get()
			if (querySnapshot.empty) {
				/* TRY REGISTRATION ON FIREBASE*/
				try {
					await usersRef.add({
						email
					})
				} catch (error) {
					return new Response('Something went wrong', {
						status: 500
					})
				}
				/* 
            TRY TO GET CUSTOM TOKEN 
               AND
            SUBSCRIPTION TO MAILER LITE 
            */
				try {
					const customToken = await getCustomToken(email);
					await createSubscriberOnMailerLite(email)
					return redirect(`/register?customToken=${customToken}`)
				} catch (err) {
					console.log('Error to Sign in with custom token :', err)
					return new Response('Something went wrong', {
						status: 500
					})
				}
			} else {
				try {
					/* GETTING CUSTOM TOKEN AND REDIRECT TO LOGIN*/
					const customToken = await getCustomToken(email);
					return redirect(`/register?customTokenAlreadyPresent=${customToken}`)
				} catch (err) {
					console.log('Error to Sign in with custom token :', err)
					return new Response('Something went wrong', {
						status: 500
					})
				}
			}
		} catch (err) {
			console.log('Error querying Firestore:', err)
			return new Response('Something went wrong', {
				status: 500
			})
		}
	}

	return redirect('/')
}
