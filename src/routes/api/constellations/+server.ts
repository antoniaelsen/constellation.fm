import { getPlaylists as getSpotifyPlaylists } from '$lib/server/api/spotify';
import { syncConstellations } from '$lib/server/db/queries/constellations';
import { disconnectSpotify } from '$lib/server/db/queries/spotify';
import {
	spotifyPlaylistMetadata,
	spotifyPlaylistsToConstellationPrototypes
} from '$lib/server/utils/spotify';
import { type ConstellationPrototype } from '$lib/types/constellations';
import { Provider, type EPlaylistMetadata } from '$lib/types/music';
import type { MaxInt } from '@spotify/web-api-ts-sdk';
import type { HttpError } from '@sveltejs/kit';

const getSpotifyPlaylistConstellations = async (
	locals: App.Locals,
	options?: { offset?: number; limit?: MaxInt<50> }
): Promise<{
	prototypes: ConstellationPrototype[];
	metadata: Record<string, EPlaylistMetadata>;
}> => {
	const { spotify: { webApi } = {} } = locals;
	if (!webApi) {
		return { prototypes: [], metadata: {} };
	}

	const playlists = await getSpotifyPlaylists(webApi, options);
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
	let metadata: Record<string, EPlaylistMetadata> = {};

	try {
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
	} catch (err) {
		if ((err as HttpError).status === 401) {
			await disconnectSpotify(userId);
		}

		return new Response(JSON.stringify({ error: `Failed to fetch constellations: ${err}` }), {
			status: (err as HttpError).status ?? 500
		});
	}

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
