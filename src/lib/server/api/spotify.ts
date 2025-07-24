import {
	DefaultResponseDeserializer,
	InMemoryCachingStrategy,
	SpotifyApi,
	type AccessToken,
	type IValidateResponses,
	type Market,
	type MaxInt,
	type PlaybackState,
	type Playlist,
	type QueryAdditionalTypes,
	type SdkOptions,
	type SimplifiedPlaylist,
	type Track,
	type TrackItem,
	type UserProfile
} from '@spotify/web-api-ts-sdk';
import { error } from '@sveltejs/kit';

import type { SpotifyAccessToken } from '$lib/types';
import { logger } from '$lib/stores/logger';

const LOGGER = logger.child({
	module: 'api-spotify'
});

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

class ResponseDeserializer extends DefaultResponseDeserializer {
	public async deserialize<TReturnType>(response: Response): Promise<TReturnType> {
		const text = await response.text();

		// The Spotify Web API is returning text (not JSON) for some endpoints.
		// Blacklist these endpoints to avoid parsing errors.
		const BLACKLIST_PARSE = [
			'https://api.spotify.com/v1/me/player/repeat',
			'https://api.spotify.com/v1/me/player/shuffle'
		];
		const blacklisted = BLACKLIST_PARSE.some((url) => response.url.startsWith(url));

		if (text.length > 0) {
			if (blacklisted) {
				return text as TReturnType;
			}

			try {
				const json = JSON.parse(text);
				return json as TReturnType;
			} catch (err) {
				throw new Error(`Failed to parse JSON: ${err}`, { cause: { code: 500 } });
			}
		}

		return null as TReturnType;
	}
}

class ResponseValidator implements IValidateResponses {
	private async _validateResponse(response: Response): Promise<void> {
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
				throw new Error(`The app has exceeded its rate limits; retry after ${retryAfter} seconds`, {
					cause: { code: 429 }
				});
			default:
				if (!response.status.toString().startsWith('20')) {
					const body = await response.text();
					throw new Error(
						`Unexpected error: (${response.status}) - ${response.statusText}${body ? `\n${body}` : ''}`,
						{ cause: { code: response.status } }
					);
				}
				break;
		}
	}

	public async validateResponse(response: Response): Promise<void> {
		try {
			await this._validateResponse(response);
		} catch (err) {
			const spotifyErr = err as SpotifyError;
			LOGGER.error(
				`Request failed: ${spotifyErr.cause?.code} - ${spotifyErr.message} ("${response.url}")`
			);
			throw error(spotifyErr.cause?.code ?? 500, spotifyErr);
		}
	}
}

const OPTS: SdkOptions = {
	beforeRequest: (url, options) => {
		// LOGGER.trace(`[${options.method}] ${url}`, options);
	},
	afterRequest: (url, options, response) => {
		// LOGGER.info(`[${options.method}] ${url} ${response.status} ${response.statusText}`, options);
	},
	cachingStrategy: new InMemoryCachingStrategy(),
	deserializer: new ResponseDeserializer(),
	responseValidator: new ResponseValidator()
};

export const getPlaybackState = async (tokens: AccessToken): Promise<PlaybackState> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	try {
		const res = await sdk.player.getPlaybackState();
		return res;
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause?.code ?? 500, `Failed to fetch playback state: ${spotifyErr}`);
	}
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
		throw error(spotifyErr.cause?.code ?? 500, `Failed to fetch playlist: ${spotifyErr}`);
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
		throw error(spotifyErr.cause?.code ?? 500, `Failed to fetch playlists: ${spotifyErr}`);
	}

	return acc;
};

export const getProfile = async (tokens: AccessToken): Promise<UserProfile> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	try {
		return await sdk.currentUser.profile();
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause?.code ?? 500, `Failed to fetch profile: ${spotifyErr}`);
	}
};

export const getTokens = async (code: string): Promise<SpotifyAccessToken> => {
	try {
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
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		LOGGER.error('Failed to fetch tokens: ', spotifyErr);
		throw error(spotifyErr.cause?.code ?? 500, `Failed to fetch tokens: ${spotifyErr}`);
	}
};

export const refreshTokens = async (refreshToken: string): Promise<SpotifyAccessToken> => {
	try {
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
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		LOGGER.error('Failed to refresh tokens: ', spotifyErr);
		throw error(spotifyErr.cause?.code ?? 500, `Failed to refresh tokens: ${spotifyErr}`);
	}
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
		throw error(spotifyErr.cause?.code ?? 500, `Failed to start playback: ${spotifyErr}`);
	}
};

export const setRepeatMode = async (
	tokens: AccessToken,
	repeatMode: 'track' | 'context' | 'off',
	deviceId?: string
): Promise<void> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	try {
		return await sdk.player.setRepeatMode(repeatMode, deviceId);
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		const statusCode = spotifyErr.cause?.code || 500;
		throw error(statusCode, `Failed to set repeat mode: ${spotifyErr}`);
	}
};

export const toggleShuffle = async (
	tokens: AccessToken,
	shuffle: boolean,
	deviceId?: string
): Promise<void> => {
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens, OPTS);

	try {
		return await sdk.player.togglePlaybackShuffle(shuffle, deviceId);
	} catch (err) {
		const spotifyErr = err as SpotifyError;
		throw error(spotifyErr.cause?.code ?? 500, `Failed to toggle shuffle: ${spotifyErr}`);
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
		throw error(spotifyErr.cause?.code ?? 500, `Failed to transfer playback: ${spotifyErr}`);
	}
};
