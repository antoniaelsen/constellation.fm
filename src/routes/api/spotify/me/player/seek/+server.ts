import { playbackSeekToPosition } from '$lib/server/api/spotify';

export async function PUT({ locals, request }) {
	const { deviceId, positionMs } = await request.json();
	if (!deviceId) {
		return new Response(JSON.stringify({ error: 'Device ID is required' }), {
			status: 400
		});
	}
	if (positionMs === undefined || positionMs === null) {
		return new Response(JSON.stringify({ error: 'Position is required' }), {
			status: 400
		});
	}

	await playbackSeekToPosition(locals.spotify.webApi, positionMs, deviceId);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
