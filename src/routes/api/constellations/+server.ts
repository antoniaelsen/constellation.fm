import { getPlaylists as getSpotifyPlaylists } from '$lib/server/api/spotify';
import { syncConstellations } from '$lib/server/db/queries/constellations';
import {
	spotifyPlaylistMetadata,
	spotifyPlaylistsToConstellationPrototypes
} from '$lib/server/utils/spotify';
import {
	Provider,
	type ConstellationPrototype,
	type PlaylistMetadata
} from '$lib/types/constellations';
import type { MaxInt } from '@spotify/web-api-ts-sdk';

const getSpotifyPlaylistConstellations = async (
	locals: App.Locals,
	options?: { offset?: number; limit?: MaxInt<50> }
): Promise<{
	prototypes: ConstellationPrototype[];
	metadata: Record<string, PlaylistMetadata>;
}> => {
	const { spotify } = locals;
	if (!spotify) {
		return { prototypes: [], metadata: {} };
	}

	const playlists = await getSpotifyPlaylists(spotify, options);
	const prototypes = spotifyPlaylistsToConstellationPrototypes(playlists);
	const metadata = Object.fromEntries(playlists.map((p) => [p.id, spotifyPlaylistMetadata(p)]));
	return { prototypes, metadata };
};

export async function GET({ locals, url }) {
	const userId = locals.userId;
	if (!userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	const providers = [Provider.SPOTIFY];
	const offset = Number(url.searchParams.get('offset')) || undefined;
	const limit = Math.min(Number(url.searchParams.get('limit')) || 0, 50) as MaxInt<50>;
	const prune = limit <= 0;

	let prototypes: ConstellationPrototype[] = [];
	let metadata: Record<string, PlaylistMetadata> = {};
	if (providers.includes(Provider.SPOTIFY)) {
		const { prototypes: spotifyPrototypes, metadata: spotifyMetadata } =
			await getSpotifyPlaylistConstellations(locals, {
				offset,
				limit
			});
		prototypes = [...prototypes, ...spotifyPrototypes];
		metadata = { ...metadata, ...spotifyMetadata };
	}
	// TODO(antoniae): add other providers

	const updated = await syncConstellations(userId, prototypes, prune);
	const response = updated.map((c) => ({
		...c,
		metadata: metadata[c.providerPlaylistId]
	}));

	return new Response(JSON.stringify(response), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
