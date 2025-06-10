import type { APIRoute } from 'astro'
import MailerLite from '@mailerlite/mailerlite-nodejs'

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY ?? ''
const GROUP_ID = process.env.MAILERLITE_GROUP_ID ?? '101178350423246269'

const mailerlite = new MailerLite({ api_key: MAILERLITE_API_KEY })

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

async function checkSubscriberOnMailerLite(email: string) {
	try {
		const res = await mailerlite.subscribers.find(email)
		return (res.data as any)?.data ?? null
	} catch (err: any) {
		if (err.response?.status === 404) return null
		console.error('❌ Error checking subscriber in MailerLite:', err)
		return null
	}
}

function getCurrentDateTime(): string {
	const now = new Date()
	const pad = (n: number) => String(n).padStart(2, '0')
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

async function createSubscriberOnMailerLite(email: string) {
	const payload = {
		email,
		status: 'unconfirmed',
		subscribed_at: getCurrentDateTime(),
		groups: [GROUP_ID],
		fields: { name: email.split('@')[0] }
	}

	try {
		const res = await mailerlite.subscribers.createOrUpdate(payload as any)
		return (res.data as any)?.data ?? null
	} catch (err) {
		console.error('❌ Error creating subscriber in MailerLite:', err)
		return null
	}
}

async function sendConfirmationEmail(email: string) {
	const confirmLink = `https://mindfulml.vialabsdigital.com/confirm?email=${encodeURIComponent(email)}`
	try {
		await mailerlite.emails.send({
			subject: 'Confirma tu suscripción',
			html: `<p>Por favor confirma tu suscripción haciendo clic en <a href="${confirmLink}">este enlace</a>.</p>`,
			from: { email: 'no-reply@mindfulml.vialabsdigital.com', name: 'Mindful ML' },
			to: [{ email }]
		} as any)
	} catch (err) {
		console.error('❌ Error sending confirmation email:', err)
		throw err
	}
}

export const OPTIONS: APIRoute = async () =>
	new Response(null, { status: 204, headers: corsHeaders })

export const GET: APIRoute = async ({ request }) => {
	let email =
		request.headers.get('Authorization') || new URL(request.url).searchParams.get('email') || ''

	if (!email) {
		return new Response(JSON.stringify({ error: 'No email provided' }), {
			status: 400,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		})
	}

	try {
		let subscriber = await checkSubscriberOnMailerLite(email)
		if (!subscriber) {
			subscriber = await createSubscriberOnMailerLite(email)
			if (!subscriber) throw new Error('Failed to create subscriber')
			await sendConfirmationEmail(email)
		}

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		})
	} catch (err) {
		console.error('❌ Unexpected error in createUser:', err)
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		})
	}
}
