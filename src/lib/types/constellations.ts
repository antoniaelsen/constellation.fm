export enum Provider {
	SPOTIFY = 'spotify'
}

export interface ProviderUser {
	provider: Provider;
	providerUserId: string;
	href?: string;
}

export enum TrackOrder {
	LINEAR = 'linear',
	SHUFFLE = 'shuffle'
}

export enum TrackLoop {
	OFF = 'off',
	CONTEXT = 'context',
	TRACK = 'track'
}

export interface PlaybackTrackInfo {
	provider: Provider;
	providerTrackId: string;
	name: string;
	artists: { name: string }[];
	album: {
		name: string;
		images: { url: string }[];
	} | null;
	isLocal: boolean;
}

/**
 * Ephemeral metadata for an album, fetched from the provider's API.
 *
 * Not stored in the database.
 */
export interface EAlbumMetadata {
	name: string;
	images: ImageMetadata[];
}

/**
 * Ephemeral metadata for an artist, fetched from the provider's API.
 *
 * Not stored in the database.
 */
export interface EArtistMetadata {
	name: string;
	href?: string;
	genres?: string[];
}

/**
 * Ephemeral metadata for a playlist, fetched from the provider's API.
 */
export interface EPlaylistMetadata {
	name: string;
	description?: string;
	images: ImageMetadata[];
	owners: ProviderUser[];
	uri: string;
}

/**
 * Ephemeral metadata for a track, fetched from the provider's API.
 *
 * Not stored in the database.
 */
export interface ETrackFeatures {
	// Key in pitch class notation (e.g. 0 = C, 1 = C#, 2 = D, etc.)
	key?: number;

	mode?: 'major' | 'minor';

	// Tempo (bpm)
	tempo?: number;

	timeSignature?: {
		beatsPerBar: number;
		beatType: number;
	};

	// Spotify-specific analysis

	// How danceable the track is (0-1)
	danceability?: number;

	// How energetic the track is (0-1)
	energy?: number;

	// How instrumental the track is (0-1)
	instrumentalness?: number;

	// How happy/positive the track is (0-1)
	valence?: number;
}

/**
 * Ephemeral metadata for a track, fetched from the provider's API.
 *
 * Not stored in the database.
 */
export interface ETrackMetadata {
	// <provider>:<providerTrackId>, e.g. "spotify:1234567890"
	key: string;
	album: EAlbumMetadata | null;
	features?: ETrackFeatures;
	artists: EArtistMetadata[];
	isLocal: boolean;
	isrc?: string;
	href?: string;
	name: string;
	uri: string;
}

export interface ImageMetadata {
	url: string;
	width?: number;
	height?: number;
}

/**
 * A constellation is a collection of playlist stars and edges.
 */
export interface Constellation {
	id: string;
	userId: string;
	provider: Provider;
	providerPlaylistId: string;
	stars: Star[];
	edges: Edge[];
	metadata?: EPlaylistMetadata;
}

export interface ConstellationMetadata {
	playlist: EPlaylistMetadata;
	stars: ETrackMetadata[];
}

export interface ConstellationPrototype {
	provider: Provider;
	providerPlaylistId: string;
	stars: StarPrototype[];
	edges: EdgePrototype[];
}

export interface Edge {
	id: string;
	sourceId: string;
	targetId: string;
}

export interface EdgePrototype {
	source: StarPrototype;
	target: StarPrototype;
}

export interface Star extends StarPrototype {
	id: string;
	constellationId: string;
	metadata?: ETrackMetadata;
}

export interface StarPrototype {
	// The ISRC of the track, if available
	isrc: string | null;

	// The provider of the track (e.g. Spotify, SoundCloud, etc.)
	provider: Provider;

	// The ID of the track in the provider's API
	// note: in Spotify, this is either the Spotify ID, or the uri (if the track is local)
	providerTrackId: string;

	// The order (sequential) of the track in the provider's playlist
	providerOrder: number;

	// The datetime of the track in the provider's playlist (to differentiate between multiple instances of the same track)
	providerTimestamp: Date;

	// Whether the track is local to the user's library
	isLocal: boolean;
}
