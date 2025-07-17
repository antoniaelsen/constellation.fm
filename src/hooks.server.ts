import { handle as handleAuthentication } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { getSpotifyConnection } from '$lib/server/db/queries/spotify';

export const handleDevtools: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	return await resolve(event);
};

export const handleAuthorization: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	const BLACKLIST = ['/api/constellations', '/api/spotify', '/api/auth'];
	if (BLACKLIST.some((path) => pathname.startsWith(path))) {
		return await resolve(event);
	}

	if (pathname === '/') {
		return await resolve(event);
	}

	const session = await event.locals.auth();
	const userId = session?.user?.id;

	if (!userId && pathname !== '/') {
		// TODO(antoniae): redirect to appropriate page
		console.error('Unauthorized - no user id in session');
		return new Response('Unauthorized', { status: 401 });
	}

	event.locals.userId = userId;

	return await resolve(event);
};

export const handleSpotifyAuthorization: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	const BLACKLIST = ['/api/spotify', '/api/constellations'];
	const WHITELIST = ['/api/spotify/auth'];

	if (
		!BLACKLIST.some((path) => pathname.startsWith(path)) ||
		WHITELIST.some((path) => pathname.startsWith(path))
	) {
		return await resolve(event);
	}

	const session = await event.locals.auth();
	const userId = session?.user?.id;
	if (!userId) {
		console.error('Unauthorized - no user id in local', event.locals);
		return new Response('Unauthorized', { status: 401 });
	}

	const tokens = await getSpotifyConnection(userId);
	if (!tokens) {
		console.error('Spotify not connected');
		return new Response('Spotify not connected', { status: 401 });
	}

	event.locals.spotify = tokens;
	event.locals.userId = userId;

	return await resolve(event);
};

export const handle: Handle = sequence(
	handleDevtools,
	handleAuthentication,
	handleAuthorization,
	handleSpotifyAuthorization
);
