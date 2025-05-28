import { eq } from 'drizzle-orm';

import { encrypt, decrypt } from './utils';
import { db } from '../index';
import { spotifyConnections } from '../schema';

export async function storeSpotifyTokens(userId, spotifyTokens, spotifyUserData) {
	const expiresAt = new Date(Date.now() + spotifyTokens.expires_in * 1000);

	const existingConnection = await db
		.select()
		.from(spotifyConnections)
		.where(eq(spotifyConnections.userId, userId))
		.limit(1);

	const tokenData = {
		userId,
		spotifyUserId: spotifyUserData.id,
		accessToken: encrypt(spotifyTokens.access_token),
		refreshToken: encrypt(spotifyTokens.refresh_token),
		expiresAt,
		scope: spotifyTokens.scope,
		updatedAt: new Date()
	};

	if (existingConnection.length > 0) {
		return await db
			.update(spotifyConnections)
			.set(tokenData)
			.where(eq(spotifyConnections.userId, userId))
			.returning();
	} else {
		return await db.insert(spotifyConnections).values(tokenData).returning();
	}
}

export async function getSpotifyTokens(userId: string) {
	const connection = await db
		.select()
		.from(spotifyConnections)
		.where(eq(spotifyConnections.userId, userId))
		.limit(1);

	if (connection.length === 0) {
		return null;
	}

	const conn = connection[0];

	return {
		accessToken: decrypt(conn.accessToken),
		refreshToken: decrypt(conn.refreshToken),
		expiresAt: conn.expiresAt,
		spotifyUserId: conn.spotifyUserId,
		scope: conn.scope,
		isActive: conn.isActive
	};
}

export async function refreshSpotifyToken(userId: string) {
	const tokens = await getSpotifyTokens(userId);

	if (!tokens) {
		throw new Error('No Spotify connection found');
	}

	const shouldRefresh = new Date(tokens.expiresAt) <= new Date(Date.now() + 5 * 60 * 1000);

	if (!shouldRefresh) {
		return tokens;
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: tokens.refreshToken
		})
	});

	if (!response.ok) {
		throw new Error('Failed to refresh Spotify token');
	}

	const newTokens = await response.json();
	const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);

	await db
		.update(spotifyConnections)
		.set({
			accessToken: encrypt(newTokens.access_token),
			refreshToken: encrypt(newTokens.refresh_token || tokens.refreshToken), // Spotify might not always return new refresh token
			expiresAt,
			updatedAt: new Date()
		})
		.where(eq(spotifyConnections.userId, userId));

	return {
		accessToken: newTokens.access_token,
		refreshToken: newTokens.refresh_token || tokens.refreshToken,
		expiresAt,
		spotifyUserId: tokens.spotifyUserId,
		scope: tokens.scope,
		isActive: tokens.isActive
	};
}

export async function disconnectSpotify(userId: string) {
	return await db
		.update(spotifyConnections)
		.set({
			isActive: false,
			updatedAt: new Date()
		})
		.where(eq(spotifyConnections.userId, userId));
}
