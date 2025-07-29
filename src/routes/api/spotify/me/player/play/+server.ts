import { startPlayback, transferPlayback } from '$lib/server/api/spotify';

export async function PUT({ locals, request }) {
	const { spotify: { webApi } = {} } = locals;
	if (!webApi) {
		return new Response(JSON.stringify({ error: 'Spotify not connected' }), {
			status: 401
		});
	}
	const { deviceId, contextUri, uris, offset, positionMs } = await request.json();
	if (!deviceId) {
		return new Response(JSON.stringify({ error: 'Device ID is required' }), {
			status: 400
		});
	}
	if (!contextUri && !uris) {
		return new Response(JSON.stringify({ error: 'Context URI or URIs is required' }), {
			status: 400
		});
	}

	await startPlayback(
		webApi,
		deviceId,
		{
			contextUri,
			uris,
			offset
		},
		positionMs
	);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
