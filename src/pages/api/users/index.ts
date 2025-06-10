import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getUserFromFirestore } from 'src/utils/getUserFromFirestore'

const MAILERLITE_API_KEY =
	process.env.MAILERLITE_CONNECT_API_KEY || process.env.MAILERLITE_API || ''

async function checkSubscriberOnMailerLite(email: string) {
	const apiKey = process.env.MAILERLITE_CONNECT_API_KEY || process.env.MAILERLITE_API
	try {
		const res = await fetch(
			`https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
			{
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				}
			}
		)

		if (res.status === 404) return null
		if (!res.ok) {
			console.error('❌ Error checking subscriber in MailerLite:', await res.text())
			return null
		}
		const data = await res.json()
		return data?.data || null
	} catch (err) {
		console.error('❌ Error connecting to MailerLite:', err)
		return null
	}
}


async function createCustomToken(userId: string): Promise<string> {
	const auth = getAuth(app)
	try {
		const customToken = await auth.createCustomToken(userId)
		return customToken
	} catch (error) {
		console.log('Error creating custom token:', error)
		throw new Error('Failed to create custom token')
	}
}

	const payload = {
		status: 'unconfirmed',
		groups: ['101178350423246269'],
		fields: { name: email.split('@')[0] }
	console.log('📤 Enviando suscriptor a MailerLite:', JSON.stringify(payload, null, 2))

	const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${MAILERLITE_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	})

	const result = await response.json().catch(() => ({}))

	if (response.status === 201 || response.status === 200) {
		console.log('✅ Suscriptor creado/actualizado en MailerLite:', result.data)
		return result.data

	console.error('❌ MailerLite rechazó la solicitud:', result)
	return null
	const day = String(now.getDate()).padStart(2, '0')
	const hours = String(now.getHours()).padStart(2, '0')
	const minutes = String(now.getMinutes()).padStart(2, '0')
	const seconds = String(now.getSeconds()).padStart(2, '0')
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

async function createSubscriberOnMailerLite(email: string) {
	const formattedDate: string = getCurrentDateTime()

	const params = {
		email,
		status: 'unconfirmed' as const,
		subscribed_at: formattedDate,
		groups: ['101178350423246269']
	}

	try {
		const response = await mailerlite.subscribers.createOrUpdate(params)
		console.log('✅ Suscriptor creado/actualizado en MailerLite:', response.data)
		return response.data
	} catch (error: any) {
		if (error?.response) {
			console.error('❌ MailerLite rechazó la solicitud:', error.response.data)
		} else {
			console.error('❌ Error al contactar con MailerLite:', error)
		}
		return null
	}

}

export const POST: APIRoute = async ({ request, redirect }) => {
	const db = getFirestore(app)
	const usersRef = db.collection('users')
	const formData = await request.formData()
	const email = formData.get('email')?.toString()
	const location = formData.get('location')?.toString() || '/'

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
					const customToken = await getCustomToken(email)

					const existingSubscriber = await checkSubscriberOnMailerLite(email)
					if (!existingSubscriber) {
						await createSubscriberOnMailerLite(email)
					}

					return redirect(`/register?customToken=${customToken}&location=${location}`)
				} catch (err) {
					console.log('Error to Sign in with custom token :', err)
					return new Response('Something went wrong', {
						status: 500
					})
				}
			} else {
				try {
					/* GETTING CUSTOM TOKEN AND REDIRECT TO LOGIN*/
					const customToken = await getCustomToken(email)
					return redirect(`/register?customTokenAlreadyPresent=${customToken}&location=${location}`)
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
