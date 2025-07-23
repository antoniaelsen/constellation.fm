import { getPlaylists } from '$lib/server/api/spotify';

export async function GET({ locals, url }) {
	const offset = url.searchParams.get('offset');
	const limit = url.searchParams.get('limit');

	try {
		const playlists = await getPlaylists(locals.spotify.webApi, {
			offset: offset ? parseInt(offset) : undefined,
			limit: limit ? parseInt(limit) : undefined
		});

		return new Response(JSON.stringify(playlists), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Failed to fetch playlists' }), {
			status: err.status ?? 500
		});
	}
}
