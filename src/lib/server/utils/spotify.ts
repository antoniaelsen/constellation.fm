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
): EPlaylistMetadata => {
	const { name, description, images, owner, uri } = playlist;
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
		owners,
		uri
	};
};

export const spotifyTrackToETrackMetadata = (track: Track): ETrackMetadata => {
	const { name, artists, album, external_ids, uri, id, is_local } = track;

	const provider = Provider.SPOTIFY;
	const providerTrackId = !is_local ? id : uri;

	const albumMetadata = album
		? {
				name: album.name,
				images: album.images.map((image) => ({
					url: image.url,
					width: image.width,
					height: image.height
				}))
			}
		: null;

	return {
		key: `${provider}:${providerTrackId}`,
		isLocal: is_local,
		isrc: external_ids?.isrc,
		name,
		album: albumMetadata,
		artists: artists.map((artist) => ({
			name: artist.name,
			href: artist.href
		})),
		uri
	};
};

export const spotifyPlaylistToStars = (
	playlist: Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
): { prototype: StarPrototype; metadata: ETrackMetadata }[] => {
	const provider = Provider.SPOTIFY;
	const { tracks } = playlist;

	return tracks.items
		.map(
			(
				playlistTrack: PlaylistedTrack<TrackItem>,
				index: number
			): { prototype: StarPrototype; metadata: ETrackMetadata } | null => {
				const { added_at } = playlistTrack;

				if (playlistTrack.track.type !== 'track') {
					return null;
				}

				const track = playlistTrack.track as Track;

				if (!track) {
					return null;
				}

				const { external_ids, id, uri, is_local } = track;

				const providerTrackId = !is_local ? id : uri;
				const isrc = external_ids?.isrc;
				const providerTimestamp = new Date(added_at);
				const providerOrder = index;

				const prototype = {
					provider,
					providerTrackId,
					providerTimestamp,
					providerOrder,
					isrc,
					isLocal: is_local
				};

				const metadata = spotifyTrackToETrackMetadata(playlistTrack.track as Track);

				return { prototype, metadata };
			}
		)
		.filter((star) => star !== null);
};

export const spotifyPlaylistToConstellation = (
	playlist: Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
): { prototype: ConstellationPrototype; metadata: ConstellationMetadata } => {
	const provider = Provider.SPOTIFY;
	const { id } = playlist;

	const stars = spotifyPlaylistToStars(playlist);
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
