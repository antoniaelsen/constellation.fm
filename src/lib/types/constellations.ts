export enum Provider {
	SPOTIFY = 'spotify'
}

export interface ProviderUser {
	provider: Provider;
	providerUserId: string;
	href?: string;
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
}

/**
 * Ephemeral metadata for a playlist, fetched from the provider's API.
 */
export interface EPlaylistMetadata {
	name: string;
	description?: string;
	images: ImageMetadata[];
	owners: ProviderUser[];
}

/**
 * Ephemeral metadata for a track, fetched from the provider's API.
 *
 * Not stored in the database.
 */
export interface ETrackMetadata {
	name: string;
	isrc?: string;
	href?: string;
	artists: EArtistMetadata[];
	album: EAlbumMetadata;
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
	isrc: string;

	provider: Provider;

	providerTrackId: string;

	// The order (sequential) of the track in the provider's playlist
	providerOrder: number;

	// The datetime of the track in the provider's playlist (to differentiate between multiple instances of the same track)
	providerTimestamp: Date;
}
