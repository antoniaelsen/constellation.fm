import type { SpotifyAccessToken } from '$lib/types';
import {
	InMemoryCachingStrategy,
	SpotifyApi,
	type AccessToken,
	type IValidateResponses,
	type Market,
	type MaxInt,
	type Playlist,
	type QueryAdditionalTypes,
	type SimplifiedPlaylist,
	type Track,
	type TrackItem,
	type UserProfile
} from '@spotify/web-api-ts-sdk';
import { error } from '@sveltejs/kit';

export const SPOTIFY_SCOPES = [
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',

	'app-remote-control',
	'streaming',

	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-private',
	'playlist-modify-public',

	'user-read-playback-position',
	'user-top-read',
	'user-read-recently-played',

	'user-library-modify',
	'user-library-read',
	'user-read-email',
	'user-read-private'
];

export const SPOTIFY_SCOPES_PLAYBACK = ['user-read-email', 'user-read-private', 'streaming'];

export const formatScope = (scope: string | string[]) => {
	const scopes = typeof scope === 'string' ? scope.split(' ') : scope;
	return scopes.sort().join(' ');
};

interface SpotifyError extends Error {
	cause: {
		code: number;
	};
}

class ResponseValidator implements IValidateResponses {
	public async validateResponse(response: Response): Promise<void> {
		switch (response.status) {
			case 401:
				throw new Error(
					'Bad or expired token. This can happen if the user revoked a token or the access token has expired. You should re-authenticate the user.',
					{ cause: { code: 401 } }
				);
			case 403:
				const body = await response.text();
				throw new Error(
					`Bad OAuth request (wrong consumer key, bad nonce, expired timestamp...). Unfortunately, re-authenticating the user won't help here. Body: ${body}`,
					{ cause: { code: 403 } }
				);
			case 429:
				const retryAfter = response.headers.get('Retry-After');
				throw new Error(
					`The app has exceeded its rate limits; retry after: ${retryAfter} seconds.`,
					{ cause: { code: 429 } }
				);
			default:
				if (!response.status.toString().startsWith('20')) {
					const body = await response.text();
					throw new Error(
						`Unrecognised response code: ${response.status} - ${response.statusText}. Body: ${body}`,
						{ cause: { code: response.status } }
					);
				}
		}
	}
}

const OPTS = {
	responseValidator: new ResponseValidator(),
	cachingStrategy: new InMemoryCachingStrategy()
};

export const getPlaylist = async (
	tokens: AccessToken,
	playlistId: string,
	options?: { market?: Market; fields?: string; additionalTypes?: QueryAdditionalTypes }
): Promise<Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	try {
		return await sdk.playlists.getPlaylist(
			playlistId,
			options?.market,
			options?.fields,
			options?.additionalTypes
		);
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause.code, `Failed to fetch playlist: ${spotifyErr.message}`);
	}
};

export const getPlaylists = async (
	tokens: AccessToken,
	options?: { limit?: MaxInt<50>; offset?: number }
): Promise<SimplifiedPlaylist[]> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);
	let { limit, offset } = options || {};
	if (limit) {
		try {
			const page = await sdk.currentUser.playlists.playlists(limit, offset);
			return page.items;
		} catch (err) {
			throw error((err as SpotifyError).cause.code, `Failed to fetch playlists: ${err}`);
		}
	}

	limit = 50;
	offset = 0;
	let acc: SimplifiedPlaylist[] = [];
	try {
		while (true) {
			const response = await sdk.currentUser.playlists.playlists(limit, offset);
			acc = [...acc, ...response.items];

			if (response.items.length < limit) {
				break;
			}

			offset += limit;
		}
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause.code, `Failed to fetch playlists: ${spotifyErr.message}`);
	}

	return acc;
};

export const getProfile = async (tokens: AccessToken): Promise<UserProfile> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	try {
		return await sdk.currentUser.profile();
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause.code, `Failed to fetch profile: ${spotifyErr.message}`);
	}
};

export const getTokens = async (code: string): Promise<SpotifyAccessToken> => {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
			).toString('base64')}`
		},
		body: new URLSearchParams({
			code,
			redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
			grant_type: 'authorization_code'
		})
	});

	return await response.json();
};

export const refreshTokens = async (refreshToken: string): Promise<SpotifyAccessToken> => {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
			).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: process.env.SPOTIFY_CLIENT_ID!
		})
	});
	return await response.json();
};

export const startPlayback = async (
	tokens: AccessToken,
	deviceId: string,
	target: { contextUri: string; offset: { position: number }; uris: string[] },
	positionMs: number
): Promise<void> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	const { contextUri, offset, uris } = target;
	try {
		return await sdk.player.startResumePlayback(deviceId, contextUri, uris, offset, positionMs);
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause.code, `Failed to start playback: ${spotifyErr.message}`);
	}
};

export const transferPlayback = async (
	tokens: AccessToken,
	deviceId: string,
	play: boolean
): Promise<void> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	try {
		return await sdk.player.transferPlayback([deviceId], play);
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause.code, `Failed to transfer playback: ${spotifyErr.message}`);
	}
};
