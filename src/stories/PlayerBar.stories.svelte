<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';
	import type { Component } from 'svelte';

	import PlayerBar, { type Props } from '$lib/client/components/player/PlayerBar.svelte';
	import { Provider, TrackLoop, TrackOrder } from '$lib/types/constellations';

	const mockTracks = [
		{
			name: 'First Track',
			artists: [
				{ name: 'Artist One', href: '/artist/1' },
				{ name: 'Artist Two', href: '/artist/2' }
			],
			album: {
				name: 'Album One',
				images: [{ url: 'https://placecats.com/200/200' }]
			},
			provider: Provider.SPOTIFY,
			providerTrackId: '1234567890',
			isLocal: false
		},
		{
			name: 'Second Track',
			artists: [{ name: 'Artist Two', href: '/artist/2' }],
			album: {
				name: 'Album Two',
				images: [{ url: 'https://placecats.com/200/200' }]
			},
			provider: Provider.SPOTIFY,
			providerTrackId: '1234567890',
			isLocal: false
		},
		{
			name: 'Third Track (local)',
			artists: [{ name: 'Artist Three', href: '/artist/3' }],
			album: {
				name: 'Album Three',
				images: [{ url: 'https://placecats.com/200/200' }]
			},
			provider: Provider.SPOTIFY,
			providerTrackId: '1234567890',
			isLocal: true
		},
		{
			name: 'Fourth Track (local, no album)',
			artists: [{ name: 'Artist Four', href: '/artist/4' }],
			album: null,
			provider: Provider.SPOTIFY,
			providerTrackId: '1234567890',
			isLocal: true
		},
		{
			name: 'Fifth Track (local, no album)',
			artists: [{ name: 'Artist Five', href: '/artist/5' }],
			album: null,
			provider: Provider.SPOTIFY,
			providerTrackId: '1234567890',
			isLocal: false
		}
	];

	const { Story } = defineMeta<
		unknown,
		Component<Props & { _currentTrackIndex: number; _interval: number }, {}, ''>
	>({
		title: 'player/PlayerBar',
		component: PlayerBar,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		args: {
			_currentTrackIndex: 0,
			_interval: 0,
			positionMs: 10,
			durationMs: 150 * 1000,
			isPlaying: false,
			repeatMode: TrackLoop.OFF,
			order: TrackOrder.LINEAR,
			onNextTrack: fn(),
			onPreviousTrack: fn(),
			onSeek: fn(),
			onTogglePlay: fn()
		}
	});
</script>

<Story
	name="Basic"
	args={{
		_currentTrackIndex: 0,
		_interval: 0,
		durationMs: 150 * 1000,
		positionMs: 10,
		isPlaying: false,
		repeatMode: TrackLoop.OFF,
		order: TrackOrder.LINEAR,
		onNextTrack: fn(),
		onPreviousTrack: fn(),
		onSeek: fn(),
		onTogglePlay: fn()
	}}
>
	{#snippet template(args)}
		{@const currentTrack = mockTracks[(args as any)._currentTrackIndex || 0]}

		<PlayerBar
			{currentTrack}
			durationMs={args.durationMs}
			positionMs={args.positionMs}
			isPlaying={args.isPlaying}
			order={args.order}
			repeatMode={args.repeatMode}
			onNextTrack={() => {
				args.onNextTrack();

				if (args.repeatMode === TrackLoop.TRACK) {
					args.positionMs = 0;
				} else {
					(args as any)._currentTrackIndex =
						((args as any)._currentTrackIndex + 1) % mockTracks.length;
					args.positionMs = 0;
				}
			}}
			onPreviousTrack={() => {
				args.onPreviousTrack();
				if (args.positionMs && args.positionMs > 3000) {
					args.positionMs = 0;
					return;
				}

				if (args.repeatMode === TrackLoop.TRACK) {
					args.positionMs = 0;
				} else {
					(args as any)._currentTrackIndex =
						((args as any)._currentTrackIndex - 1 + mockTracks.length) % mockTracks.length;
					args.positionMs = 0;
				}
			}}
			onSeek={(newPosition) => {
				args.onSeek(newPosition);
				args.positionMs = newPosition;
			}}
			onToggleLoop={() => {
				args.repeatMode =
					args.repeatMode === TrackLoop.OFF
						? TrackLoop.CONTEXT
						: args.repeatMode === TrackLoop.CONTEXT
							? TrackLoop.TRACK
							: TrackLoop.OFF;
			}}
			onToggleOrder={() => {
				args.order = args.order === TrackOrder.LINEAR ? TrackOrder.SHUFFLE : TrackOrder.LINEAR;
			}}
			onTogglePlay={() => {
				args.onTogglePlay();
				args.isPlaying = !args.isPlaying;

				if (args.isPlaying) {
					(args as any)._interval = setInterval(() => {
						args.positionMs = (args.positionMs || 0) + 1000;
					}, 1000);
				} else {
					clearInterval((args as any)._interval);
				}
			}}
		/>
	{/snippet}
</Story>

<Story
	name="Inactive"
	args={{
		currentTrack: null,
		isPlaying: false,
		onNextTrack: fn(),
		onPreviousTrack: fn(),
		onSeek: fn(),
		onTogglePlay: fn(),
		onToggleLoop: fn(),
		onToggleOrder: fn()
	}}
/>
