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
	type ConstellationPrototype,
	type PlaylistMetadata,
	type StarPrototype
} from '$lib/types/constellations';

export const spotifyPlaylistMetadata = (
	playlist:
		| Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
		| SimplifiedPlaylist
): PlaylistMetadata => {
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

export const spotifyPlaylistToStarPrototypes = (
	playlist: Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
): StarPrototype[] => {
	const provider = Provider.SPOTIFY;
	const { tracks } = playlist;

	return tracks.items.map((playlistTrack: PlaylistedTrack<TrackItem>) => ({
		provider,
		providerTrackId: playlistTrack.track.id,
		providerOrder: playlistTrack.added_at,
		isrc: (playlistTrack.track as Track).external_ids?.isrc
	}));
};

export const spotifyPlaylistToConstellationPrototype = (
	playlist: Playlist<QueryAdditionalTypes extends undefined ? Track : TrackItem>
): ConstellationPrototype => {
	const provider = Provider.SPOTIFY;
	const { id } = playlist;

	const stars = spotifyPlaylistToStarPrototypes(playlist);
	const edges = stars.slice(0, -1).map((star: StarPrototype, i: number) => ({
		source: stars[i],
		target: stars[i + 1]
	}));

	return {
		provider,
		providerPlaylistId: id,
		stars,
		edges
	};
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
