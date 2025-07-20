import { eq } from 'drizzle-orm';

import {
	formatScope,
	refreshTokens,
	SPOTIFY_SCOPES,
	SPOTIFY_SCOPES_PLAYBACK
} from '$lib/server/api/spotify';
import { encrypt, decrypt } from '$lib/server/db/queries/utils';
import type { SpotifyAccessToken } from '$lib/types';
import { db } from '../index';
import { spotifyConnections } from '../schema';

export async function upsertSpotifyConnection(userId: string, tokenData: SpotifyAccessToken) {
	const expires = Date.now() + tokenData.expires_in * 1000;
	if (!tokenData) {
		return;
	}

	const values = {
		accessToken: encrypt(tokenData.access_token),
		refreshToken: encrypt(tokenData.refresh_token),
		tokenType: tokenData.token_type,
		scope: formatScope(tokenData.scope),
		expires: expires
	};

	return await db
		.insert(spotifyConnections)
		.values({
			...values,
			userId
		})
		.onConflictDoUpdate({
			target: [spotifyConnections.userId, spotifyConnections.scope],
			set: values
		});
}

export async function getSpotifyConnection(userId: string): Promise<{
	webApi: SpotifyAccessToken | null;
	playbackApi: SpotifyAccessToken | null;
} | null> {
	if (!userId) {
		return null;
	}

	const connections = await db
		.select()
		.from(spotifyConnections)
		.where(eq(spotifyConnections.userId, userId));

	if (connections.length === 0) {
		return null;
	}

	const decryptOrRefresh = async (
		conn: typeof spotifyConnections.$inferSelect | null
	): Promise<SpotifyAccessToken | null> => {
		if (!conn) {
			return null;
		}

		const expired = conn.expires <= Date.now();
		const expiresIn = expired ? 0 : conn.expires - Date.now();

		if (expired) {
			console.log('SPOTIFY - getSpotifyConnection - refreshing', conn.scope);
			const refreshed = await refreshSpotifyConnection(userId, decrypt(conn.refreshToken));
			if (!refreshed) {
				console.log('SPOTIFY - getSpotifyConnection - failed to refresh', conn.scope);
				return null;
			}
			console.log('SPOTIFY - getSpotifyConnection - refreshed', conn.scope);
			return refreshed;
		}

		return {
			access_token: decrypt(conn.accessToken),
			refresh_token: decrypt(conn.refreshToken),
			token_type: conn.tokenType,
			expires_in: expiresIn,
			scope: conn.scope
		};
	};

	const scopeWebApi = formatScope(SPOTIFY_SCOPES);
	const scopePlaybackApi = formatScope(SPOTIFY_SCOPES_PLAYBACK);
	const existingWebApi = connections.find((conn) => conn.scope === scopeWebApi);
	const existingPlaybackApi = connections.find((conn) => conn.scope === scopePlaybackApi);

	return {
		webApi: existingWebApi ? await decryptOrRefresh(existingWebApi) : null,
		playbackApi: existingPlaybackApi ? await decryptOrRefresh(existingPlaybackApi) : null
	};
}

export async function refreshSpotifyConnection(
	userId: string,
	refreshToken: string
): Promise<SpotifyAccessToken | null> {
	if (!userId || !refreshToken) {
		return null;
	}

	let tokens: SpotifyAccessToken;
	try {
		tokens = await refreshTokens(refreshToken);
	} catch (error) {
		console.error('Error refreshing Spotify tokens:', error);
		return null;
	}

	if (!tokens) {
		console.error('SPOTIFY - refreshSpotifyConnection - no tokens');
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
		scope: formatScope(scope)
	};
}

export async function disconnectSpotify(userId: string) {
	return await db.delete(spotifyConnections).where(eq(spotifyConnections.userId, userId));
}
