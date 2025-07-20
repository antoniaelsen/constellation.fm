import { getPlaylist } from '$lib/server/api/spotify';

export async function GET({ locals, params }) {
	const { spotify: { webApi } = {} } = locals;
	if (!webApi) {
		return new Response(JSON.stringify({ error: 'Spotify not connected' }), {
			status: 401
		});
	}

	const playlist = await getPlaylist(webApi, params.playlistId);

	return new Response(JSON.stringify(playlist), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
