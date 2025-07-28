import { writable } from 'svelte/store';
import { type PlaybackTrackInfo, Provider, TrackLoop, TrackOrder } from '$lib/types/music';
import type { PlaybackState } from '@spotify/web-api-ts-sdk';

export interface PlayerState {
	contextUri: string | null;
	deviceId: string | null;
	deviceIdLocal: string | null;
	durationMs: number | null;
	isPlaying: boolean;
	order: TrackOrder;
	progressMs: number | null;
	repeatMode: TrackLoop;
	window: {
		current: PlaybackTrackInfo | null;
		next: PlaybackTrackInfo | null;
		previous: PlaybackTrackInfo | null;
	};
}

export const toPlaybackTrack = (track: any): PlaybackTrackInfo => {
	const { linked_from, id, name, artists, album, is_local, uri } = track;
	const providerTrackId = !is_local ? (linked_from?.id ?? id) : uri;
	const albumMetadata = album
		? {
				name: album.name,
				images: album.images.map((image: any) => ({ url: image.url }))
			}
		: null;

	return {
		album: albumMetadata,
		artists: artists.map((artist: any) => ({ name: artist.name })),
		isLocal: is_local,
		name,
		provider: Provider.SPOTIFY,
		providerTrackId
	};
};

export const toPlayerState = (spotifyState: PlaybackState): Omit<PlayerState, 'deviceIdLocal'> => {
	const { is_playing, device, progress_ms, repeat_state, shuffle_state, context, item } =
		spotifyState;
	return {
		contextUri: context?.uri ?? null,
		deviceId: device?.id ?? null,
		durationMs: item?.duration_ms ?? 0,
		isPlaying: is_playing,
		order: shuffle_state ? TrackOrder.SHUFFLE : TrackOrder.LINEAR,
		progressMs: progress_ms ?? 0,
		repeatMode:
			repeat_state === 'track'
				? TrackLoop.TRACK
				: repeat_state === 'context'
					? TrackLoop.CONTEXT
					: TrackLoop.OFF,
		window: {
			next: null,
			previous: null,
			current: item ? toPlaybackTrack(item) : null
		}
	};
};

export const playerState = writable<PlayerState>({
	contextUri: null,
	deviceId: null,
	deviceIdLocal: null,
	durationMs: 0,
	isPlaying: false,
	order: TrackOrder.LINEAR,
	progressMs: 0,
	repeatMode: TrackLoop.OFF,
	window: {
		current: null,
		next: null,
		previous: null
	}
});
