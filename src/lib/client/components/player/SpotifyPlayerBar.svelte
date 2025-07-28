<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		setRepeatMode,
		setShuffle,
		useInvalidatePlayerDevices,
		usePlaybackPause,
		usePlaybackSeekToPosition,
		usePlaybackSkipNext,
		usePlaybackSkipPrevious,
		usePlaybackStart
	} from '$lib/client/api/spotify';
	import { toPlaybackTrack } from '$lib/client/stores/player';
	import { type Device, TrackLoop, TrackOrder, type PlaybackTrackInfo } from '$lib/types/music';

	import DeviceMenu from './DeviceMenu.svelte';
	import PlayerBar from './PlayerBar.svelte';

	const PLAYER_NAME = 'constellation.fm';

	interface PlayerState {
		contextUri: string | null;
		currentTrack: PlaybackTrackInfo | null;
		deviceId: string | null;
		deviceIdLocal: string | null;
		durationMs: number | null;
		progressMs: number | null;
		isPlaying: boolean;
		order: TrackOrder;
		repeatMode: TrackLoop;
	}

	type PlayerStateUpdate =
		| Omit<PlayerState, 'currentTrack'>
		| {
				window?: {
					current: PlaybackTrackInfo | null;
					next: PlaybackTrackInfo | null;
					previous: PlaybackTrackInfo | null;
				};
		  };

	interface Props {
		className?: string;
		devices: Device[];
		playerState: PlayerState;
		onDeviceSelect?: (device: Device) => void;
		onPlayerStateChange: (playerState: Partial<PlayerStateUpdate>) => void;
	}

	let { className, devices, playerState, onDeviceSelect, onPlayerStateChange, ...rest }: Props =
		$props();
	let isLocal = $derived(playerState.deviceIdLocal === playerState.deviceId);

	let mPause = usePlaybackPause();
	let mStart = usePlaybackStart();
	let mSeekToPosition = usePlaybackSeekToPosition();
	let mSkipNext = usePlaybackSkipNext();
	let mSkipPrevious = usePlaybackSkipPrevious();

	let contextUri = $derived(playerState.contextUri);
	let deviceId = $derived(playerState.deviceId);
	let progressMs = $derived(playerState.progressMs);
	let isPlaying = $derived(playerState.isPlaying);
	let order = $derived(playerState.order);
	let repeatMode = $derived(playerState.repeatMode);

	let session = $derived($page.data.session);
	let spotifyPlaybackApi = $derived(session?.spotify?.playbackApi);

	let player: any;
	let isScriptLoaded = $state(false);
	let positionInterval: ReturnType<typeof setInterval> | undefined;

	const onSeek = (newPosition: number) => {
		if (!isLocal) {
			if (!deviceId) return;
			$mSeekToPosition.mutate({ deviceId, positionMs: newPosition });
			return;
		}

		if (!player) return;
		player.seek(newPosition);
	};

	const onTogglePlay = () => {
		if (!isLocal) {
			if (!deviceId || !contextUri) return;
			if (isPlaying) {
				$mPause.mutate(deviceId);
			} else {
				const isPlaylist = contextUri.startsWith('spotify:playlist:');
				$mStart.mutate({
					deviceId,
					contextUri,
					offset: isPlaylist ? { position: progressMs ?? 0 } : undefined,
					positionMs: progressMs ?? 0
				});
			}
			return;
		}

		if (!player) return;
		player.togglePlay();
	};

	const onPreviousTrack = () => {
		if (!isLocal) {
			if (!deviceId) return;
			if (progressMs !== null && progressMs > 3000) {
				$mSeekToPosition.mutate({ deviceId, positionMs: 0 });
				return;
			}

			$mSkipPrevious.mutate(deviceId);
			return;
		}

		if (!player) return;
		if (progressMs !== null && progressMs > 3000) {
			player.seek(0);
			return;
		}

		player.previousTrack();
	};

	const onNextTrack = () => {
		if (!isLocal) {
			if (!deviceId) return;
			$mSkipNext.mutate(deviceId);
			return;
		}
		if (!player) return;
		player.nextTrack();
	};

	const onToggleOrder = () => {
		const target = order === TrackOrder.SHUFFLE ? TrackOrder.LINEAR : TrackOrder.SHUFFLE;
		setShuffle(target === TrackOrder.SHUFFLE, deviceId).then(() => {
			onPlayerStateChange({
				order: target
			});
		});
	};

	const onToggleLoop = () => {
		const target: 'track' | 'context' | 'off' =
			repeatMode === TrackLoop.OFF ? 'context' : repeatMode === TrackLoop.CONTEXT ? 'track' : 'off';

		setRepeatMode(target, deviceId).then(() => {
			onPlayerStateChange({
				repeatMode:
					target === 'track'
						? TrackLoop.TRACK
						: target === 'context'
							? TrackLoop.CONTEXT
							: TrackLoop.OFF
			});
		});
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
			if (progressMs === null) {
				return;
			}
			onPlayerStateChange({
				progressMs: progressMs + 1000
			});
		}, 1000);
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
		if (isPlaying) {
			startPositionInterval();
		} else {
			clearPositionInterval();
		}
	});

	$effect(() => {
		const invalidatePlayerDevices = useInvalidatePlayerDevices();

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
				invalidatePlayerDevices();
				onPlayerStateChange({
					deviceIdLocal: device_id
				});
			});

			player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
				console.log('Spotify Web Player - No longer ready with Device ID', device_id);
				invalidatePlayerDevices();
				onPlayerStateChange({
					deviceIdLocal: null
				});
			});

			player.addListener('player_state_changed', (state: any) => {
				// console.log('Spotify Web Player - Player state changed', state);
				if (!state) {
					clearPositionInterval();
					return;
				}

				const { current_track, next_tracks, previous_tracks } = state.track_window;
				onPlayerStateChange({
					isPlaying: !state.paused,
					progressMs: state.position,
					window: {
						current: current_track ? toPlaybackTrack(current_track) : null,
						next: next_tracks?.[0] ? toPlaybackTrack(next_tracks?.[0]) : null,
						previous: previous_tracks?.[0] ? toPlaybackTrack(previous_tracks?.[0]) : null
					}
				});
			});

			player.connect();
		}
	});
</script>

<PlayerBar
	{className}
	currentTrack={playerState.currentTrack}
	durationMs={playerState.durationMs}
	positionMs={playerState.progressMs}
	isPlaying={playerState.isPlaying}
	order={playerState.order}
	repeatMode={playerState.repeatMode}
	{onToggleOrder}
	{onToggleLoop}
	{onSeek}
	{onTogglePlay}
	{onPreviousTrack}
	{onNextTrack}
	{...rest}
>
	{#snippet right()}
		<DeviceMenu {devices} {onDeviceSelect} />
	{/snippet}
</PlayerBar>
