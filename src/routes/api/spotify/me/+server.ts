import { getProfile } from '$lib/server/api/spotify';

export async function GET({ locals }) {
	const profile = await getProfile(locals.spotify.webApi);

	return new Response(JSON.stringify(profile), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
