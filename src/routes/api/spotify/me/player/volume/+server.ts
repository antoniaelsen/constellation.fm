import { playbackSetVolume } from '$lib/server/api/spotify';

export async function PUT({ locals, request }) {
	const { deviceId, volume } = await request.json();
	if (!deviceId) {
		return new Response(JSON.stringify({ error: 'Device ID is required' }), {
			status: 400
		});
	}
	if (volume === undefined || volume === null) {
		return new Response(JSON.stringify({ error: 'Volume is required' }), {
			status: 400
		});
	}
	if (volume < 0 || volume > 100) {
		return new Response(JSON.stringify({ error: 'Volume must be between 0 and 100' }), {
			status: 400
		});
	}

	await playbackSetVolume(locals.spotify.webApi, volume, deviceId);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
