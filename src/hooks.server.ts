// import { redirect, type Handle } from '@sveltejs/kit';
import { handle as handleAuthentication } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

// const WHITELIST = ['/signin', '/signout'];
// async function handleAuthorization({ event, resolve }: { event: any; resolve: any }) {
// 	console.log('ROUTE:', event.url.pathname);
// 	if (!WHITELIST.some((path) => event.url.pathname.startsWith(path))) {
// 		const session = await event.locals.auth();
// 		if (!session) {
// 			// throw redirect(303, '/signin');
// 		}
// 	}

// 	return resolve(event);
// }

// export const handle: Handle = sequence(handleAuthentication);

export const handleDevtools: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	return await resolve(event);
};

export const handle: Handle = sequence(handleDevtools, handleAuthentication);
