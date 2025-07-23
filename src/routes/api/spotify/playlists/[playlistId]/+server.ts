import { getPlaylist } from '$lib/server/api/spotify';

export async function GET({ locals, params }) {
	const playlist = await getPlaylist(locals.spotify.webApi, params.playlistId);

	return new Response(JSON.stringify(playlist), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
