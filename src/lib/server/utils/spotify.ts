import type {
	Playlist,
	PlaylistedTrack,
	QueryAdditionalTypes,
	SimplifiedPlaylist,
	Track,
	TrackItem
} from '@spotify/web-api-ts-sdk';
import {
	Provider,
	type ConstellationMetadata,
	type ConstellationPrototype,
	type ETrackMetadata,
	type EPlaylistMetadata,
	type StarPrototype
} from '$lib/types/constellations';

/**
 * Get the metadata for a Spotify playlist
 * @param playlist - The Spotify playlist
 * @returns The metadata for the playlist
 */
export const spotifyPlaylistMetadata = (
	playlist:
		| Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
		| SimplifiedPlaylist
): EPl => {
	const { name, description, images, owner } = playlist;
	const owners = [
		{
			provider: Provider.SPOTIFY,
			providerUserId: owner.id,
			href: owner.href
		}
	];

	return {
		name,
		description,
		images: images || [],
		owners
	};
};

export const spotifyTrackToETrackMetadata = (track: Track): ETrackMetadata => {
	const { name, artists, album, external_ids } = track;
	return {
		isrc: external_ids?.isrc,
		name,
		artists: artists.map((artist) => ({
			name: artist.name,
			href: artist.href
		})),
		album: {
			name: album.name,
			images: album.images.map((image) => ({
				url: image.url,
				width: image.width,
				height: image.height
			}))
		}
	};
};

export const spotifyPlaylistToStar = (
	playlist: Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
): { prototype: StarPrototype; metadata: ETrackMetadata }[] => {
	const provider = Provider.SPOTIFY;
	const { tracks } = playlist;

	return tracks.items.map((playlistTrack: PlaylistedTrack<TrackItem>) => {
		const prototype = {
			provider,
			providerTrackId: playlistTrack.track.id,
			providerOrder: playlistTrack.added_at,
			isrc: (playlistTrack.track as Track).external_ids?.isrc
		};

		// TODO(antoniae): handle episodes
		const metadata = spotifyTrackToETrackMetadata(playlistTrack.track as Track);

		return { prototype, metadata };
	});
};

export const spotifyPlaylistToConstellation = (
	playlist: Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
): { prototype: ConstellationPrototype; metadata: ConstellationMetadata } => {
	const provider = Provider.SPOTIFY;
	const { id } = playlist;

	const stars = spotifyPlaylistToStar(playlist);
	const starPrototypes = stars.map((star) => star.prototype);
	const edgePrototypes = starPrototypes.slice(0, -1).map((star: StarPrototype, i: number) => ({
		source: starPrototypes[i],
		target: starPrototypes[i + 1]
	}));

	const prototype = {
		provider,
		providerPlaylistId: id,
		stars: starPrototypes,
		edges: edgePrototypes
	};

	const metadata = {
		playlist: spotifyPlaylistMetadata(playlist),
		stars: stars.map((star) => star.metadata)
	};

	return { prototype, metadata };
};

export const spotifyPlaylistsToConstellationPrototypes = (
	playlists: SimplifiedPlaylist[]
): ConstellationPrototype[] => {
	const provider = Provider.SPOTIFY;

	return playlists.map((playlist) => ({
		provider,
		providerPlaylistId: playlist.id,
		stars: [],
		edges: []
	}));
};
