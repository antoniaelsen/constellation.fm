import type { Session as SvelteKitSession, User as SvelteKitUser } from '@auth/sveltekit';
import type { AccessToken } from '@spotify/web-api-ts-sdk';

export enum SortOrder {
	ASCENDING = 'ascending',
	DESCENDING = 'descending'
}

export interface Session extends SvelteKitSession {
	user: SvelteKitUser & {
		id: string;
	};
	spotify: SpotifyAuth | null;
}

export interface SpotifyAccessToken extends AccessToken {
	scope: string;
}

export interface SpotifyAuth {
	webApi: {
		expires: number;
		scopes: string;
	} | null;
	playbackApi: {
		accessToken: string;
		expires: number;
		scopes: string;
	} | null;
}
