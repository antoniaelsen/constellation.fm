import { getProfile } from '$lib/server/api/spotify';

export async function GET({ locals }) {
	const { spotify: { webApi } = {} } = locals;
	if (!webApi) {
		return new Response(JSON.stringify({ error: 'Spotify not connected' }), {
			status: 401
		});
	}

	const profile = await getProfile(webApi);

	return new Response(JSON.stringify(profile), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
