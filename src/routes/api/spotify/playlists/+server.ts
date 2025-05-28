export async function GET({ locals }) {
	const user = await locals.auth();
	const spotifyTokens = await getSpotifyTokens(user.sub);

	const response = await fetch('https://api.spotify.com/v1/me/playlists', {
		headers: {
			Authorization: `Bearer ${spotifyTokens.accessToken}`
		}
	});

	return response;
}
