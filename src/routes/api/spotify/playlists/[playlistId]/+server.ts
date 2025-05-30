import { getPlaylist } from '$lib/server/api/spotify';

export async function GET({ locals, params }) {
	const { spotify } = locals;

	const playlist = await getPlaylist(spotify.accessToken, params.playlistId);

	return new Response(JSON.stringify(playlist), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
