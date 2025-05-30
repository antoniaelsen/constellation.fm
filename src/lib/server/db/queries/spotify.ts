import type { AccessToken } from '@spotify/web-api-ts-sdk';
import { eq } from 'drizzle-orm';

import { refreshTokens } from '$lib/server/api/spotify';
import { encrypt, decrypt } from '$lib/server/db/queries/utils';
import type { SpotifyAuth } from '$lib/types';
import { db } from '../index';
import { spotifyConnections } from '../schema';

export async function createSpotifyConnection(userId: string, data: SpotifyAuth) {
	const expires = Date.now() + data.expires_in * 1000;
	if (!data) {
		return;
	}
	const values = {
		accessToken: encrypt(data.access_token),
		refreshToken: encrypt(data.refresh_token),
		tokenType: data.token_type,
		scope: data.scope,
		expires
	};

	return await db
		.insert(spotifyConnections)
		.values({
			...values,
			userId
		})
		.onConflictDoUpdate({
			target: spotifyConnections.userId,
			set: values
		});
}

export async function getSpotifyConnection(userId: string): Promise<SpotifyAuth | null> {
	if (!userId) {
		return null;
	}

	const connection = await db
		.select()
		.from(spotifyConnections)
		.where(eq(spotifyConnections.userId, userId))
		.limit(1);

	if (connection.length === 0) {
		return null;
	}

	const conn = connection[0];

	const shouldRefresh = conn.expires <= Date.now();
	if (!shouldRefresh) {
		const expiresIn = conn.expires - Date.now();
		return {
			access_token: decrypt(conn.accessToken),
			refresh_token: decrypt(conn.refreshToken),
			token_type: conn.tokenType,
			expires_in: expiresIn,
			scope: conn.scope
		};
	}

	const { refreshToken } = conn;
	return refreshSpotifyConnection(userId, refreshToken);
}

export async function refreshSpotifyConnection(
	userId: string,
	refreshToken: string
): Promise<SpotifyAuth | null> {
	if (!userId || !refreshToken) {
		return null;
	}

	let tokens: SpotifyAuth;
	try {
		tokens = await refreshTokens(refreshToken);
	} catch (error) {
		console.error('Error refreshing Spotify tokens:', error);
		return null;
	}

	if (!tokens) {
		return null;
	}

	const { access_token, refresh_token, expires_in, token_type, scope } = tokens;
	if (!access_token || !refresh_token || !expires_in || !token_type || !scope) {
		return null;
	}

	const expires = Date.now() + expires_in * 1000;

	await db
		.update(spotifyConnections)
		.set({
			accessToken: encrypt(tokens.access_token),
			refreshToken: encrypt(tokens.refresh_token),
			expires,
			tokenType: token_type
		})
		.where(eq(spotifyConnections.userId, userId));

	return {
		access_token,
		refresh_token,
		token_type,
		expires_in,
		scope
	};
}

export async function disconnectSpotify(userId: string) {
	return await db.delete(spotifyConnections).where(eq(spotifyConnections.userId, userId));
}
