import { redirect } from '@sveltejs/kit';
import { storeSpotifyTokens, upsertUser } from '$lib/server/db/queries/users';
import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REDIRECT_URI
} from '$env/static/private';

export async function load({ url, locals }) {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	const user = await locals.auth();
	console.log('auth spotify callback, user', user);

	if (error) {
		console.log('redirecting to dashboard with error');
		throw redirect(302, '/dashboard?error=spotify_auth_failed');
	}

	if (!code || !user) {
		console.log('redirecting to login');
		throw redirect(302, '/');
	}

	try {
		console.log('upserting user');
		await upsertUser(user);

		const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: SPOTIFY_REDIRECT_URI
			})
		});

		if (!tokenResponse.ok) {
			throw new Error('Failed to exchange code for tokens');
		}

		const tokens = await tokenResponse.json();

		const userResponse = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`
			}
		});

		const spotifyUser = await userResponse.json();

		await storeSpotifyTokens(user.sub, tokens, spotifyUser);

		throw redirect(302, '/dashboard?connected=spotify');
	} catch (error) {
		console.error('Spotify connection error:', error);
		throw redirect(302, '/dashboard?error=spotify_connection_failed');
	}
}
