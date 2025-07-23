import { toggleShuffle } from '$lib/server/api/spotify';

export async function PUT({ locals, request }) {
	const { deviceId, state } = await request.json();
	if (state === undefined) {
		return new Response(JSON.stringify({ error: 'State is required' }), {
			status: 400
		});
	}

	await toggleShuffle(locals.spotify.webApi, state, deviceId);

	return new Response(null, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
