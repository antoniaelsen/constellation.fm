<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import PlayerBar from './PlayerBar.svelte';
	import { Provider, type PlaybackTrackInfo } from '$lib/types/constellations';

	const PLAYER_NAME = 'constellation.fm';

	interface Props {
		className?: string;
		currentTrack: PlaybackTrackInfo | null;
		onDeviceIdChange: (deviceId: string | null) => void;
		onTrackWindowChange: ({
			current,
			next,
			previous
		}: {
			current: PlaybackTrackInfo | null;
			next: PlaybackTrackInfo | null;
			previous: PlaybackTrackInfo | null;
		}) => void;
	}
	const { currentTrack, onDeviceIdChange, onTrackWindowChange, ...rest }: Props = $props();

	let session = $derived($page.data.session);
	let spotifyPlaybackApi = $derived(session?.spotify?.playbackApi);

	let player: any;
	let duration = $state(0);
	let position = $state(0);
	let isActive = $state(false);
	let isPaused = $state(false);
	let isScriptLoaded = $state(false);
	let positionInterval: ReturnType<typeof setInterval> | undefined;

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

		if (position > 3000) {
			player.seek(0);
			return;
		}

		player.previousTrack();
	};

	const onNextTrack = () => {
		if (!player) return;
		player.nextTrack();
	};

	const clearPositionInterval = () => {
		if (positionInterval) {
			clearInterval(positionInterval);
			positionInterval = undefined;
		}
	};

	const startPositionInterval = () => {
		clearPositionInterval();
		positionInterval = setInterval(() => {
			position += 1000; // Increment by 1 second
		}, 1000);
	};

	const toPlaybackTrack = (track: any): PlaybackTrackInfo => {
		return {
			provider: Provider.SPOTIFY,
			providerTrackId: track.linked_from?.id ?? track.id,
			name: track.name,
			artists: track.artists.map((artist: any) => ({ name: artist.name })),
			album: {
				name: track.album.name,
				images: track.album.images.map((image: any) => ({ url: image.url }))
			}
		};
	};

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			console.log('Spotify Web Player - Script loaded');
			isScriptLoaded = true;
		};

		return () => {
			clearPositionInterval();
			if (player) {
				console.log('Spotify Web Player - Disconnecting');
				player.disconnect();
			}
			document.body.removeChild(script);
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
				console.log('Spotify Web Player - Ready with Device ID', device_id);
				onDeviceIdChange(device_id);
			});

			player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
				console.log('Spotify Web Player - No longer ready with Device ID', device_id);
				onDeviceIdChange(null);
			});

			player.addListener('player_state_changed', (state: any) => {
				// console.log('Player - Player state changed', state);
				if (!state) {
					clearPositionInterval();
					return;
				}

				const { current_track, next_tracks, previous_tracks } = state.track_window;
				onTrackWindowChange({
					current: current_track ? toPlaybackTrack(current_track) : null,
					next: next_tracks?.[0] ? toPlaybackTrack(next_tracks?.[0]) : null,
					previous: previous_tracks?.[0] ? toPlaybackTrack(previous_tracks?.[0]) : null
				});
				isPaused = state.paused;
				position = state.position;
				duration = state.duration;

				// Start or stop the position interval based on pause state
				if (isPaused) {
					clearPositionInterval();
				} else {
					startPositionInterval();
				}

				player.getCurrentState().then((state: any) => {
					isActive = !!state;
				});
			});

			player.connect();
		}
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
