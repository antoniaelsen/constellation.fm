import { playbackSkipNext } from '$lib/server/api/spotify';

export async function POST({ locals, request }) {
	const { deviceId } = await request.json();
	await playbackSkipNext(locals.spotify.webApi, deviceId);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
