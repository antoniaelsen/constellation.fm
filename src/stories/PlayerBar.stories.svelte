<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';

	import PlayerBar from '$lib/client/components/player/PlayerBar.svelte';
	import { Provider, TrackLoop, TrackOrder } from '$lib/types/constellations';

	const mockTracks = [
		{
			name: 'First Track',
			artists: [{ name: 'Artist One', href: '/artist/1' }],
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
		_currentTrackIndex: 0,
		duration: 150 * 1000,
		position: 10,
		isActive: true,
		isPaused: false,
		loop: TrackLoop.OFF,
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
			duration={args.duration}
			position={args.position}
			isActive={args.isActive}
			isPaused={args.isPaused}
			loop={args.loop}
			order={args.order}
			onNextTrack={() => {
				args.onNextTrack();
				args._currentTrackIndex = (args._currentTrackIndex + 1) % mockTracks.length;
				args.position = 10;
			}}
			onPreviousTrack={() => {
				args.onPreviousTrack();
				if (args.position > 3000) {
					args.position = 0;
					return;
				}

				args._currentTrackIndex =
					(args._currentTrackIndex - 1 + mockTracks.length) % mockTracks.length;
				args.position = 10;
			}}
			onSeek={(newPosition) => {
				args.onSeek(newPosition);
				args.position = newPosition;
			}}
			onToggleLoop={() => {
				args.loop =
					args.loop === TrackLoop.OFF
						? TrackLoop.CONTEXT
						: args.loop === TrackLoop.CONTEXT
							? TrackLoop.TRACK
							: TrackLoop.OFF;
			}}
			onToggleOrder={() => {
				args.order = args.order === TrackOrder.LINEAR ? TrackOrder.SHUFFLE : TrackOrder.LINEAR;
			}}
			onTogglePlay={() => {
				args.onTogglePlay();
				args.isPaused = !args.isPaused;
			}}
		/>
	{/snippet}
</Story>

<Story
	name="Inactive"
	args={{
		currentTrack: null,
		isActive: false,
		isPaused: true,
		onNextTrack: fn(),
		onPreviousTrack: fn(),
		onSeek: fn(),
		onTogglePlay: fn(),
		onToggleLoop: fn(),
		onToggleOrder: fn()
	}}
/>
