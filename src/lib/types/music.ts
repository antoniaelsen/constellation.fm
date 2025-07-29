export enum Provider {
	SPOTIFY = 'spotify'
}

export enum DeviceType {
	SMARTPHONE = 'smartphone',
	COMPUTER = 'computer',
	SPEAKER = 'speaker'
}

export interface Device {
	id: string | null;
	isActive: boolean;
	isRestricted: boolean;
	isVolumeSupported: boolean;
	name: string;
	type: DeviceType;
	volume: number;
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
