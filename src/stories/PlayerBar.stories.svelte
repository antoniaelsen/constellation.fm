<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';
	import PlayerBar from '$lib/client/components/player/PlayerBar.svelte';

	const mockTracks = [
		{
			name: 'First Track',
			artists: [{ name: 'Artist One', href: '/artist/1' }],
			album: {
				name: 'Album One',
				images: [{ url: 'https://placecats.com/200/200' }]
			}
		},
		{
			name: 'Second Track',
			artists: [{ name: 'Artist Two', href: '/artist/2' }],
			album: {
				name: 'Album Two',
				images: [{ url: 'https://placecats.com/200/200' }]
			}
		},
		{
			name: 'Third Track',
			artists: [{ name: 'Artist Three', href: '/artist/3' }],
			album: {
				name: 'Album Three',
				images: [{ url: 'https://placecats.com/200/200' }]
			}
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
			onTogglePlay={() => {
				args.onTogglePlay();
				args.isPaused = !args.isPaused;
			}}
		/>
	{/snippet}
</Story>
