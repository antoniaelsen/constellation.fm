import { getPlaylists } from '$lib/server/api/spotify';
import type { MaxInt } from '@spotify/web-api-ts-sdk';
import type { HttpError } from '@sveltejs/kit';

export async function GET({ locals, url }) {
	const offset = url.searchParams.get('offset');
	const limit = url.searchParams.get('limit');

	try {
		const playlists = await getPlaylists(locals.spotify.webApi, {
			offset: offset ? parseInt(offset) : undefined,
			limit: limit ? (Math.max(Math.min(parseInt(limit), 50), 1) as MaxInt<50>) : undefined
		});

		return new Response(JSON.stringify(playlists), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Failed to fetch playlists' }), {
			status: (err as HttpError).status ?? 500
		});
	}
}
