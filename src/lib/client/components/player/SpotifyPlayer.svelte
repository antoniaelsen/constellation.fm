<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		// currentTrack: SpotifyApi.TrackObjectFull;
		token: string;
	}

	let { token }: Props = $props();

	let player: any;
	let currentTrack = $state<any>(null);
	let duration = $state(0);
	let position = $state(0);
	let isActive = $state(false);
	let isPaused = $state(false);

	const onSeek = (newPosition: number) => {
		if (!player) return;
		console.log('Player - Seeking to', newPosition);
		player.seek(newPosition);
	};

	const onTogglePlay = () => {
		if (!player) return;
		player.togglePlay();
	};

	const onPreviousTrack = () => {
		if (!player) return;
		player.previousTrack();
	};

	const onNextTrack = () => {
		if (!player) return;
		player.nextTrack();
	};

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			player = new window.Spotify.Player({
				name: 'Constellation.fm Web Player',
				getOAuthToken: (cb: (token: string) => void) => {
					cb(token);
				},
				volume: 0.5
			});

			player.addListener('ready', ({ device_id }: { device_id: string }) => {
				console.log('Player - Ready with Device ID', device_id);
			});

			player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
				console.log('Player - Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', (state: any) => {
				console.log('Player - Player state changed', state);
				if (!state) {
					return;
				}

				currentTrack = state.track_window.current_track;
				isPaused = state.paused;
				position = state.position;
				duration = state.duration;

				player.getCurrentState().then((state: any) => {
					isActive = !!state;
				});
			});

			player.connect();
		};

		return () => {
			if (!player) {
				return;
			}
			console.log('Player - Disconnecting');
			player.disconnect();
		};
	});
</script>
