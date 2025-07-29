import { playbackStart } from '$lib/server/api/spotify';

export async function PUT({ locals, request }) {
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

	await playbackStart(
		locals.spotify.webApi,
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
