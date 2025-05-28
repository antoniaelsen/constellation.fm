import {
	SvelteKitAuth,
	type Session as SvelteKitSession,
	type User as SvelteKitUser
} from '@auth/sveltekit';
import Auth0 from '@auth/sveltekit/providers/auth0';

import { drizzleAdapter } from './lib/db/schema';
import { getSpotifyTokens } from './lib/db/queries/spotify';

export interface Session extends SvelteKitSession {
	user: SvelteKitUser & {
		id: string;
		spotify: {
			expiresAt: Date;
		} | null;
	};
}

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: drizzleAdapter,
	providers: [Auth0({ authorization: { params: { prompt: 'login' } } })],
	callbacks: {
		async session({ session, user }): Promise<Session> {
			const spotifyDb = await getSpotifyTokens(user.id);
			const spotify = spotifyDb
				? {
						expiresAt: spotifyDb.expiresAt
					}
				: null;

			const updated: Session = {
				...session,
				user: {
					...session.user,
					id: user.id,
					spotify
				}
			};

			console.log('updating session', { session, user, spotify });
			return updated;
		}
	}
});
