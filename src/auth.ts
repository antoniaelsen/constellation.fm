import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0 from '@auth/sveltekit/providers/auth0';

import { drizzleAdapter } from '$lib/server/db/schema';
import { getSpotifyConnection } from '$lib/server/db/queries/spotify';
import type { Session } from '$lib/types';

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: drizzleAdapter,
	providers: [Auth0({ authorization: { params: { prompt: 'login' } } })],
	callbacks: {
		async session({ session, user }): Promise<Session> {
			const spotifyDb = await getSpotifyConnection(user.id);
			const spotify = spotifyDb
				? {
						expires: spotifyDb.expires!,
						scopes: spotifyDb.scope
					}
				: null;

			const updated: Session = {
				...session,
				user: {
					...session.user,
					id: user.id
				},
				spotify
			};

			return updated;
		}
	}
});
