import { getPlaylist } from '$lib/server/api/spotify';
import {
	spotifyPlaylistToConstellationPrototype,
	spotifyPlaylistMetadata
} from '$lib/server/utils/spotify';
import { getConstellation, syncConstellation } from '$lib/server/db/queries/constellations';
import {
	Provider,
	type ConstellationPrototype,
	type PlaylistMetadata
} from '$lib/types/constellations';

const getSpotifyPlaylistConstellation = async (
	locals: App.Locals,
	playlistId: string
): Promise<{
	prototype: ConstellationPrototype | null;
	metadata: PlaylistMetadata | null;
}> => {
	const { spotify } = locals;
	if (!spotify) {
		return { prototype: null, metadata: null };
	}

	const playlist = await getPlaylist(spotify, playlistId);
	const prototype = spotifyPlaylistToConstellationPrototype(playlist);
	const metadata = spotifyPlaylistMetadata(playlist);

	return { prototype, metadata };
};

export async function GET({ locals, params }) {
	const userId = locals.userId;
	if (!userId) {
		return new Response(JSON.stringify({ error: 'User not found' }), {
			status: 401
		});
	}

	const constellationId = params.constellationId;
	const constellation = await getConstellation(userId, constellationId);
	if (!constellation) {
		return new Response(JSON.stringify({ error: 'Constellation not found' }), {
			status: 404
		});
	}

	let prototype = null;
	let metadata = null;

	const { provider, providerPlaylistId } = constellation;
	switch (provider) {
		case Provider.SPOTIFY: {
			const { spotify } = locals;
			if (!spotify) {
				return new Response(JSON.stringify({ error: 'Spotify access token not found' }), {
					status: 401
				});
			}
			({ prototype, metadata } = await getSpotifyPlaylistConstellation(locals, providerPlaylistId));
			break;
		}
		default:
			return new Response(JSON.stringify({ error: 'Unsupported provider' }), {
				status: 400
			});
	}

	if (!prototype) {
		return new Response(JSON.stringify({ error: 'Failed to fetch playlist' }), {
			status: 400
		});
	}

	const update = !constellation.stars?.length ? prototype : { ...prototype, edges: [] };
	const updated = await syncConstellation(userId, constellationId, update);
	const response = { ...updated, metadata };

	return new Response(JSON.stringify(response), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
