import { getPlaylists } from '$lib/server/api/spotify';

export async function GET({ locals, url }) {
	const { spotify } = locals;
	if (!spotify) {
		return new Response(JSON.stringify({ error: 'Spotify not connected' }), {
			status: 401
		});
	}

	const offset = url.searchParams.get('offset');
	const limit = url.searchParams.get('limit');

	const playlists = await getPlaylists(spotify, {
		offset: offset ? parseInt(offset) : undefined,
		limit: limit ? parseInt(limit) : undefined
	});

	return new Response(JSON.stringify(playlists), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
