// src/pages/api/check-subscriber.ts

import { getAuth } from 'firebase-admin/auth'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import MailerLite from '@mailerlite/mailerlite-nodejs'

if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API || ''
})

export async function GET({ cookies }) {
  try {
    const auth = getAuth()
    const sessionCookie = cookies.get('session')?.value

    if (!sessionCookie) {
      return new Response(JSON.stringify({ authenticated: false }), { status: 401 })
    }

    const decodedCookie = await auth.verifySessionCookie(sessionCookie)
    const user = await auth.getUser(decodedCookie.uid)

    // Buscamos el email en MailerLite
    const response = await mailerlite.subscribers.find(user.email)

    const status = response?.data?.data?.status || 'unknown'

    return new Response(JSON.stringify({
      authenticated: true,
      email: user.email,
      subscriptionStatus: status, // active, unconfirmed, unsubscribed
    }), { status: 200 })

  } catch (error) {
    console.error('Error en check-subscriber:', error)
    return new Response(JSON.stringify({ authenticated: false }), { status: 401 })
  }
}
