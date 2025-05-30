export enum Provider {
	SPOTIFY = 'spotify'
}

export interface ProviderUser {
	provider: Provider;
	providerUserId: string;
	href?: string;
}

/**
 * Ephemeral metadata for a playlist, fetched from the provider's API.
 */
export interface PlaylistMetadata {
	name: string;
	description?: string;
	images: {
		url: string;
		width?: number;
		height?: number;
	}[];
	owners: ProviderUser[];
}

/**
 * Ephemeral metadata for a track, fetched from the provider's API.
 */
export interface TrackMetadata {
	name: string;
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
	metadata?: PlaylistMetadata;
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

export interface Star {
	id: string;
	constellationId: string;
	isrc: string;
	provider: Provider;
	providerTrackId: string;
	providerOrder: string; // The order (sequential) of the track in the provider's playlist
	metadata?: TrackMetadata;
}

export interface StarPrototype {
	isrc: string;
	provider: Provider;
	providerTrackId: string;
	providerOrder: string;
}
