import { getAvailableDevices } from '$lib/server/api/spotify';

export async function GET({ locals }) {
	const devices = await getAvailableDevices(locals.spotify.webApi);

	return new Response(JSON.stringify(devices), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
