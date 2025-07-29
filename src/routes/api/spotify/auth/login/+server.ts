import { env } from '$env/dynamic/private';
import { SPOTIFY_SCOPES, SPOTIFY_SCOPES_PLAYBACK } from '$lib/server/api/spotify';

export async function GET({ locals }) {
	const session = await locals.auth();
	const spotify = session?.spotify;

	const scope = !spotify?.webApi ? SPOTIFY_SCOPES : SPOTIFY_SCOPES_PLAYBACK;

	const state = crypto.randomUUID();
	const params = new URLSearchParams({
		response_type: 'code',
		client_id: env.SPOTIFY_CLIENT_ID!,
		scope: scope.join(' '),
		redirect_uri: env.SPOTIFY_REDIRECT_URI!,
		state
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: `https://accounts.spotify.com/authorize?${params}`
		}
	});
}
