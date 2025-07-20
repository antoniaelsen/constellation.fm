import { writable } from 'svelte/store';
import type { PlaybackTrackInfo } from '$lib/types/constellations';

export const playerState = writable<{
	deviceId: string | null;
	isShuffling: boolean;
	isRepeating: 'none' | 'track' | 'context';
	window: {
		current: PlaybackTrackInfo | null;
		next: PlaybackTrackInfo | null;
		previous: PlaybackTrackInfo | null;
	};
}>({
	deviceId: null,
	isShuffling: false,
	isRepeating: 'none',
	window: {
		current: null,
		next: null,
		previous: null
	}
});
