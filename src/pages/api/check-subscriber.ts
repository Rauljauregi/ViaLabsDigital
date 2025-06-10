import { getAuth } from 'firebase-admin/auth'
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
	const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
	initializeApp({
		credential: cert(serviceAccount)
	})
}

const MAILERLITE_API_KEY = process.env.MAILERLITE_CONNECT_API_KEY || process.env.MAILERLITE_API!
const MAILERLITE_BASE_URL = 'https://connect.mailerlite.com/api/subscribers'

export async function GET({
	cookies
}: {
	cookies: { get: (name: string) => { value?: string } | undefined }
}) {
	try {
		const auth = getAuth(getApp())
		const db = getFirestore()

		const sessionCookie = cookies.get('session')?.value

		if (!sessionCookie) {
			console.log('❌ No session cookie')
			return new Response(JSON.stringify({ authenticated: false }), { status: 401 })
		}

		const decodedCookie = await auth.verifySessionCookie(sessionCookie)
		console.log('✅ Session verificada. UID:', decodedCookie.uid)

		const userRef = db.collection('users').doc(decodedCookie.uid)
		const userSnap = await userRef.get()

		if (!userSnap.exists || !userSnap.data()?.email) {
			console.log('❌ Usuario sin email válido en Firestore')
			return new Response(JSON.stringify({ authenticated: false }), { status: 401 })
		}

		const userEmail = userSnap.data()!.email

		const res = await fetch(`${MAILERLITE_BASE_URL}/${encodeURIComponent(userEmail)}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${MAILERLITE_API_KEY}`,
				'Content-Type': 'application/json'
			}
		})

		if (res.status === 404) {
			console.log(`⚠️ El suscriptor ${userEmail} no está en MailerLite`)
			return new Response(JSON.stringify({ authenticated: true, subscriber: null }), {
				status: 200
			})
		}

		if (!res.ok) {
			console.error(`❌ Error al consultar MailerLite: ${res.statusText}`)
			return new Response(JSON.stringify({ authenticated: false }), { status: 500 })
		}

		const subscriberResponse = await res.json()
		console.log('✅ Suscriptor encontrado en MailerLite:', subscriberResponse)

		return new Response(
			JSON.stringify({
				authenticated: true,
				subscriber: subscriberResponse
			}),
			{ status: 200 }
		)
	} catch (error) {
		console.error('❌ Error general en check-subscriber:', error)
		return new Response(JSON.stringify({ authenticated: false }), { status: 401 })
	}
}
