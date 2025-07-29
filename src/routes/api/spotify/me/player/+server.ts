import { transferPlayback } from '$lib/server/api/spotify';

export async function PUT({ locals, request }) {
	const { spotify: { webApi } = {} } = locals;
	if (!webApi) {
		return new Response(JSON.stringify({ error: 'Spotify not connected' }), {
			status: 401
		});
	}
	const { deviceId, play = false } = await request.json();
	if (!deviceId) {
		return new Response(JSON.stringify({ error: 'Device ID is required' }), {
			status: 400
		});
	}

	const playlist = await transferPlayback(webApi, deviceId, play);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
