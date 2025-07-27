import { getPlaylist } from '$lib/server/api/spotify';
import { spotifyPlaylistToConstellation } from '$lib/server/utils/spotify';
import { getConstellation, syncEdges, syncStars } from '$lib/server/db/queries/constellations';
import {
	Provider,
	type Constellation,
	type ConstellationMetadata,
	type ConstellationPrototype
} from '$lib/types/constellations';

/**
 * Get a constellation from its Spotify playlist, including ephemeral Spotify metadata
 * @param locals
 * @param playlistId
 * @returns
 */
const getSpotifyPlaylistConstellation = async (
	locals: App.Locals,
	playlistId: string
): Promise<{
	prototype: ConstellationPrototype | null;
	metadata: ConstellationMetadata | null;
}> => {
	const { spotify: { webApi } = {} } = locals;
	if (!webApi) {
		return { prototype: null, metadata: null };
	}

	const playlist = await getPlaylist(webApi, playlistId);
	const { prototype, metadata } = spotifyPlaylistToConstellation(playlist);

	return { prototype, metadata };
};

const zipConstellationMetadata = (
	constellation: Constellation,
	metadata: ConstellationMetadata
): Constellation => {
	const starMetadata = Object.fromEntries(metadata.stars.map((star) => [star.key, star]));

	return {
		...constellation,
		metadata: metadata.playlist,
		stars: constellation.stars.map((star) => ({
			...star,
			metadata: starMetadata[`${Provider.SPOTIFY}:${star.providerTrackId}`]
		}))
	};
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
			const { spotify: { webApi } = {} } = locals;
			if (!webApi) {
				return new Response(JSON.stringify({ error: 'Spotify access token not found' }), {
					status: 401
				});
			}
			try {
				({ prototype, metadata } = await getSpotifyPlaylistConstellation(
					locals,
					providerPlaylistId
				));
			} catch (err) {
				// fine
			}
			break;
		}
		default:
			return new Response(JSON.stringify({ error: 'Unsupported provider' }), {
				status: 400
			});
	}

	if (!metadata) {
		return new Response(JSON.stringify({ error: 'Failed to fetch metadata' }), {
			status: 500
		});
	}

	if (prototype) {
		const stars = await syncStars(userId, constellationId, prototype.stars);

		const empty = !constellation.stars?.length || !constellation.edges?.length;
		if (empty) {
			await syncEdges(userId, constellationId, prototype.edges, stars);
		}

		const updated = await getConstellation(userId, constellationId);
		if (!updated) {
			return new Response(JSON.stringify({ error: 'Failed to update constellation' }), {
				status: 500
			});
		}

		const response = zipConstellationMetadata(updated, metadata);
		return new Response(JSON.stringify(response), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	return new Response(JSON.stringify(constellation), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
