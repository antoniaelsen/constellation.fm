import { playbackSkipPrevious } from '$lib/server/api/spotify';

export async function POST({ locals, request }) {
	const { deviceId } = await request.json();
	if (!deviceId) {
		return new Response(JSON.stringify({ error: 'Device ID is required' }), {
			status: 400
		});
	}

	await playbackSkipPrevious(locals.spotify.webApi, deviceId);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
