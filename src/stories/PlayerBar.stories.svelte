<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';

	import PlayerBar from '$lib/client/components/player/PlayerBar.svelte';
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
			providerTrackId: '1234567890'
		},
		{
			name: 'Second Track',
			artists: [{ name: 'Artist Two', href: '/artist/2' }],
			album: {
				name: 'Album Two',
				images: [{ url: 'https://placecats.com/200/200' }]
			},
			provider: Provider.SPOTIFY,
			providerTrackId: '1234567890'
		},
		{
			name: 'Third Track',
			artists: [{ name: 'Artist Three', href: '/artist/3' }],
			album: {
				name: 'Album Three',
				images: [{ url: 'https://placecats.com/200/200' }]
			},
			provider: Provider.SPOTIFY,
			providerTrackId: '1234567890'
		}
	];

	const { Story } = defineMeta({
		title: 'player/PlayerBar',
		component: PlayerBar,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		args: {
			currentTrackIndex: 0,
			position: 10,
			duration: 150 * 1000,
			isActive: true,
			isPaused: false,
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
		_interval: 0,
		_currentTrackIndex: 0,
		durationMs: 150 * 1000,
		positionMs: 10,
		isActive: true,
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
		{@const currentTrack = mockTracks[args._currentTrackIndex || 0]}

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
					args._currentTrackIndex = (args._currentTrackIndex + 1) % mockTracks.length;
					args.positionMs = 0;
				}
			}}
			onPreviousTrack={() => {
				args.onPreviousTrack();
				if (args.positionMs > 3000) {
					args.positionMs = 0;
					return;
				}

				if (args.repeatMode === TrackLoop.TRACK) {
					args.positionMs = 0;
				} else {
					args._currentTrackIndex =
						(args._currentTrackIndex - 1 + mockTracks.length) % mockTracks.length;
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
					args._interval = setInterval(() => {
						args.positionMs += 1000;
					}, 1000);
				} else {
					clearInterval(args._interval);
				}
			}}
		/>
	{/snippet}
</Story>

<Story
	name="Inactive"
	args={{
		currentTrack: null,
		isActive: false,
		isPlaying: false,
		onNextTrack: fn(),
		onPreviousTrack: fn(),
		onSeek: fn(),
		onTogglePlay: fn(),
		onToggleLoop: fn(),
		onToggleOrder: fn()
	}}
/>
