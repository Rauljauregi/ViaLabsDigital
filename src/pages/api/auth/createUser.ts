import type { APIRoute } from 'astro'
import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getUserFromFirestore } from '../../../utils/getUserFromFirestore'

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

if (!getApps().length) {
	const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
	initializeApp({
		credential: cert(serviceAccount)
	})
}

async function createSubscriberOnMailerLite(email: string) {
	const now = new Date()
	const format = (n: number) => String(n).padStart(2, '0')
	const formattedDate = `${now.getFullYear()}-${format(now.getMonth() + 1)}-${format(now.getDate())} ${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`

	const payload = {
		email,
		status: 'unconfirmed',
		subscribed_at: formattedDate,
		groups: ['101178350423246269'],
		fields: { name: email.split('@')[0] }
	}

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
	}

	console.error('❌ MailerLite rechazó la solicitud:', result)
	return null
}

export const GET: APIRoute = async ({ request }) => {
	const auth = getAuth(getApp())
	const db = getFirestore()
	const usersRef = db.collection('users')

	let email = request.headers.get('Authorization')

	if (!email) {
		const url = new URL(request.url)
		email = url.searchParams.get('email') || undefined
	}

	if (!email) {
		console.error('❌ No email provided')
		return new Response('No email provided', { status: 400 })
	}

	try {
		const querySnapshot = await getUserFromFirestore(email)
		let token = ''

		const existingSubscriber = await checkSubscriberOnMailerLite(email)
		if (!existingSubscriber) {
			const created = await createSubscriberOnMailerLite(email)
			if (!created) {
				return new Response('Error creating subscriber in MailerLite', { status: 500 })
			}
		}

		if (querySnapshot.empty) {
			console.log(`⚠️ No user found with email: ${email}. Creating new user.`)

			const newUserRef = await usersRef.add({ email })
			console.log('✅ User registered in Firestore with ID:', newUserRef.id)

			try {
				const newAuthUser = await auth.createUser({
					uid: newUserRef.id,
					email
				})
				console.log('✅ User registered in Firebase Auth:', newAuthUser.uid)

				token = await auth.createCustomToken(newAuthUser.uid)
			} catch (authError) {
				console.error('❌ Error creating user in Firebase Auth:', authError)
				return new Response('Error creating user in Auth', { status: 500 })
			}
		} else {
			const userDoc = querySnapshot.docs[0]
			console.log('✅ User found in Firestore with ID:', userDoc.id)

			try {
				const firebaseUser = await auth.getUser(userDoc.id)
				console.log('✅ User found in Firebase Auth:', firebaseUser.uid)

				token = await auth.createCustomToken(firebaseUser.uid)
			} catch (getUserError) {
				console.warn('⚠️ User not in Firebase Auth, creating...', getUserError)

				try {
					const newAuthUser = await auth.createUser({
						uid: userDoc.id,
						email
					})
					console.log('✅ User created in Firebase Auth:', newAuthUser.uid)

					token = await auth.createCustomToken(newAuthUser.uid)
				} catch (authError) {
					console.error('❌ Failed to create user in Firebase Auth:', authError)
					return new Response('Error creating user in Auth', { status: 500 })
				}
			}
		}

		console.log('✅ Custom token generated:', token)
		return new Response(JSON.stringify({ token }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization'
			}
		})
	} catch (error) {
		console.error('❌ Unexpected error in getCustomToken:', error)
		return new Response('Unexpected error', { status: 500 })
	}
}
