import { getPlaylists } from '$lib/server/api/spotify';

export async function GET({ locals, url }) {
	const { spotify: { webApi } = {} } = locals;
	if (!webApi) {
		return new Response(JSON.stringify({ error: 'Spotify not connected' }), {
			status: 401
		});
	}

	const offset = url.searchParams.get('offset');
	const limit = url.searchParams.get('limit');

	try {
		const playlists = await getPlaylists(webApi, {
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
			status: error.status ?? 500
		});
	}
}
