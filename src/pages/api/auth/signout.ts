import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ redirect, cookies }) => {
   console.log("SIGNOUT BITCH")
	cookies.delete('session', {
		path: '/'
	})
	return redirect('/')
}
