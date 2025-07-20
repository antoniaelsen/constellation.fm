<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import PlayerBar, { type Props as PlayerBarProps } from './PlayerBar.svelte';

	const PLAYER_NAME = 'constellation.fm';

	export interface Props extends PlayerBarProps {}
	const rest = $props();

	let session = $derived($page.data.session);
	let spotifyPlaybackApi = $derived(session?.spotify?.playbackApi);
	$inspect(spotifyPlaybackApi);

	let player: any;
	let currentTrack = $state<any>(null);
	let duration = $state(0);
	let position = $state(0);
	let isActive = $state(false);
	let isPaused = $state(false);
	let isScriptLoaded = $state(false);

	const onSeek = (newPosition: number) => {
		if (!player) return;
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
			console.log('Player - Script loaded');
			isScriptLoaded = true;
		};
	});

	$effect(() => {
		const token = spotifyPlaybackApi?.accessToken;
		if (token && isScriptLoaded && !player) {
			if (!token || !isScriptLoaded || !spotifyPlaybackApi) return;

			player = new window.Spotify.Player({
				name: PLAYER_NAME,
				getOAuthToken: (cb: (token: string) => void) => {
					cb(token);
				},
				volume: 0.5
			});

			player.addListener('ready', ({ device_id }: { device_id: string }) => {
				// console.log('Player - Ready with Device ID', device_id);
			});

			player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
				// console.log('Player - Device ID has gone offline', device_id);
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
		}
	});

	$effect.root(() => {
		return () => {
			if (player) {
				console.log('Player - Disconnecting');
				player.disconnect();
			}
		};
	});
</script>

<PlayerBar
	{currentTrack}
	{duration}
	{position}
	{isActive}
	{isPaused}
	{onSeek}
	{onTogglePlay}
	{onPreviousTrack}
	{onNextTrack}
	{...rest}
/>
