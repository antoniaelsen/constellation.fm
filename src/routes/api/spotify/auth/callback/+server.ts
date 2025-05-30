import { getTokens } from '$lib/server/api/spotify';
import { createSpotifyConnection } from '$lib/server/db/queries/spotify';

export async function GET({ url, locals }) {
	const session = await locals.auth();

	if (!session?.user?.id) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	if (!code) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/?error=code_missing`
			}
		});
	}
	if (!state) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/?error=state_mismatch`
			}
		});
	}

	let data = null;
	try {
		data = await getTokens(code);
	} catch (error) {
		console.error('Error getting Spotify token:', error);
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/?error=token_error`
			}
		});
	}

	const userId = session.user.id;

	await createSpotifyConnection(userId, data);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
