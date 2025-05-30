import type { SpotifyAuth } from '$lib/types';
import {
	SpotifyApi,
	type AccessToken,
	type Market,
	type MaxInt,
	type Playlist,
	type QueryAdditionalTypes,
	type SimplifiedPlaylist,
	type Track,
	type TrackItem,
	type UserProfile
} from '@spotify/web-api-ts-sdk';

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

export const getPlaylist = async (
	tokens: AccessToken,
	playlistId: string,
	options?: { market?: Market; fields?: string; additionalTypes?: QueryAdditionalTypes }
): Promise<Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>> => {
	console.log('SPOTIFY - getPlaylist', options);
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens);

	return await sdk.playlists.getPlaylist(
		playlistId,
		options?.market,
		options?.fields,
		options?.additionalTypes
	);
};

export const getPlaylists = async (
	tokens: AccessToken,
	options?: { limit?: MaxInt<50>; offset?: number }
): Promise<SimplifiedPlaylist[]> => {
	console.log('SPOTIFY - getPlaylists', options);
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens);
	let { limit, offset } = options || {};
	if (limit) {
		const page = await sdk.currentUser.playlists.playlists(limit, offset);
		return page.items;
	}

	limit = 50;
	offset = 0;
	let acc: SimplifiedPlaylist[] = [];
	while (true) {
		const response = await sdk.currentUser.playlists.playlists(limit, offset);
		acc = [...acc, ...response.items];

		if (response.items.length < limit) {
			break;
		}

		offset += limit;
	}

	return acc;
};

export const getProfile = async (tokens: AccessToken): Promise<UserProfile> => {
	console.log('SPOTIFY - getProfile');
	const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, tokens);

	return await sdk.currentUser.profile();
};

export const getTokens = async (code: string): Promise<SpotifyAuth> => {
	console.log('SPOTIFY - getTokens');
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

export const refreshTokens = async (refreshToken: string): Promise<SpotifyAuth> => {
	console.log('SPOTIFY - refreshTokens');
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
