import type { APIRoute } from 'astro'
import { app } from '../../../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import MailerLite from '@mailerlite/mailerlite-nodejs'

const mailerlite = new MailerLite({
  api_key: process.env.MAILERLITE_API || '',
})

function getCurrentDateTime(): string {
  const now = new Date()
  const format = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${format(now.getMonth() + 1)}-${format(now.getDate())} ${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`
}

async function createSubscriberOnMailerLite(email: string) {
  const formattedDate = getCurrentDateTime()

  const params = {
    email,
    status: 'unconfirmed',
    groups: ['101178350423246269'],
    subscribed_at: formattedDate
  }

  try {
    const res = await mailerlite.subscribers.createOrUpdate(params)
    console.log('✅ Suscriptor creado en MailerLite:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ Error al crear suscriptor en MailerLite:', error?.response?.data || error)
    return null
  }
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app)
  const db = getFirestore(app)
  const usersRef = db.collection('users')

  const formData = await request.formData()
  const email = formData.get('email')?.toString()
  const location = formData.get('location')?.toString() || '/'

  if (!email) {
    return new Response('Missing email', { status: 400 })
  }

  try {
    let uid: string
    const querySnapshot = await usersRef.where('email', '==', email).get()

    if (querySnapshot.empty) {
      // Crear nuevo documento
      const newUserRef = usersRef.doc()
      uid = newUserRef.id
      await newUserRef.set({ email })

      const subscriber = await createSubscriberOnMailerLite(email)
      if (!subscriber) {
        console.warn('⚠️ Usuario creado pero MailerLite falló para:', email)
      }
    } else {
      uid = querySnapshot.docs[0].id
    }

    // Crear token personalizado
    const customToken = await auth.createCustomToken(uid)
    return redirect(`/register?customToken=${customToken}&location=${location}`)

  } catch (error) {
    console.error('❌ Error general en createUser:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
