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
	spotify: {
		expires: number;
		scopes: string;
	} | null;
}

export interface SpotifyAuth extends AccessToken {
	scope: string;
}
