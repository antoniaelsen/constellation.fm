import { getProfile } from '$lib/server/api/spotify';

export async function GET({ locals }) {
	const { spotify } = locals;
	if (!spotify) {
		return new Response(JSON.stringify({ error: 'Spotify not connected' }), {
			status: 401
		});
	}

	const profile = await getProfile(spotify);

	return new Response(JSON.stringify(profile), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
