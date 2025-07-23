import { getPlaybackState, transferPlayback } from '$lib/server/api/spotify';

export async function GET({ locals, request }) {
	const playbackState = await getPlaybackState(locals.spotify.webApi);

	return new Response(JSON.stringify(playbackState), {
		headers: {
			'Content-Type': 'application/json'
		},
		status: 200
	});
}

export async function PUT({ locals, request }) {
	const { deviceId, play = false } = await request.json();
	if (!deviceId) {
		return new Response(JSON.stringify({ error: 'Device ID is required' }), {
			status: 400
		});
	}

	await transferPlayback(locals.spotify.webApi, deviceId, play);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
