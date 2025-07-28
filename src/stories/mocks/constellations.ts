import { type Constellation } from '$lib/types/constellations';
import {
	Provider,
	type EAlbumMetadata,
	type EArtistMetadata,
	type ETrackMetadata
} from '$lib/types/music';

const N_CONSTELLATIONS = 10;
const N_STARS = 25;

export const MOCK_ARTIST: EArtistMetadata = {
	name: 'Mock Artist',
	href: ''
};

export const MOCK_ALBUM: EAlbumMetadata = {
	name: 'Mock Album',
	images: [{ url: 'https://placecats.com/200/200', width: 200, height: 200 }]
};

export const CONSTELLATIONS: Constellation[] = [
	...Array.from({ length: N_CONSTELLATIONS }, (_, i) => ({
		id: i.toString(),
		userId: i.toString(),
		provider: Provider.SPOTIFY,
		providerPlaylistId: i.toString(),
		stars: Array.from({ length: N_STARS }, (_, s) => ({
			id: s.toString(),
			constellationId: i.toString(),
			provider: Provider.SPOTIFY,
			providerTrackId: s.toString(),
			providerTimestamp: new Date(),
			providerOrder: s,
			isrc: `ISRC-${s}`,
			metadata: {
				name: `Mock Track ${s}`,
				artists: [MOCK_ARTIST],
				album: MOCK_ALBUM,
				uri: 'mock-uri',
				isLocal: false,
				key: 'mock-key'
			},
			isLocal: false
		})),
		edges: Array.from({ length: N_STARS - 1 }, (_, e) => ({
			id: e.toString(),
			constellationId: i.toString(),
			sourceId: e.toString(),
			targetId: (e + 1).toString()
		}))
	}))
];

export const mockTrack = (): ETrackMetadata => ({
	name: 'Mock Track',
	artists: [MOCK_ARTIST],
	album: MOCK_ALBUM,
	isrc: 'ISRC-1234567890',
	isLocal: false,
	key: 'mock-key',
	uri: 'mock-uri'
});
