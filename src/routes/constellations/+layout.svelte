<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Stars } from '@threlte/extras';

	import { page } from '$app/stores';
	import { useAllConstellations } from '$lib/client/api/constellations';
	import {
		useAvailableDevices,
		usePlaybackState,
		useTransferPlayback
	} from '$lib/client/api/spotify';
	import Scene from '$lib/client/components/constellations/Scene.svelte';
	import SpotifyPlayerBar from '$lib/client/components/player/SpotifyPlayerBar.svelte';
	import { playerState, toPlayerState } from '$lib/client/stores/player';
	import { TrackLoop, TrackOrder, type Device, type PlaybackTrackInfo } from '$lib/types/music';

	import Sidebar from './sidebar.svelte';
	import type { PlaybackState } from '@spotify/web-api-ts-sdk';
	import { untrack } from 'svelte';

	let { children } = $props();

	let open = $state(true);

	const onClose = () => {
		open = false;
	};

	const onOpen = () => {
		open = true;
	};

	const onPlayerStateChange = (update: {
		localDeviceId?: string | null;
		isPlaying?: boolean;
		repeatMode?: TrackLoop;
		order?: TrackOrder;
		durationMs?: number | null;
		progressMs?: number | null;
		currentDevice?: {
			id?: string | null;
			isRestricted?: boolean;
			isVolumeSupported?: boolean;
			volume?: number;
		} | null;
		window?: {
			current: PlaybackTrackInfo | null;
			next: PlaybackTrackInfo | null;
			previous: PlaybackTrackInfo | null;
		};
	}) => {
		let currentDevice = null;
		if (!!update.currentDevice || !!$playerState.currentDevice) {
			currentDevice = {
				...$playerState.currentDevice,
				...update.currentDevice
			};
		}

		$playerState = {
			...$playerState,
			...update,
			currentDevice: currentDevice as any,
			window: {
				...$playerState.window,
				...update.window
			}
		};
	};

	const rAvailableDevices = useAvailableDevices({
		refetchOnWindowFocus: false,
		retry: false,
		refetchInterval: 10000
	});
	const rConstellations = useAllConstellations({ refetchOnWindowFocus: false, retry: false });
	const rPlaybackState = usePlaybackState({
		refetchOnWindowFocus: false,
		retry: false,
		refetchInterval: 5000
	});
	const mDevices = useTransferPlayback();

	let stateSlice = $derived({
		contextUri: $playerState.contextUri,
		currentTrack: $playerState.window.current,
		localDeviceId: $playerState.localDeviceId,
		durationMs: $playerState.durationMs,
		isPlaying: $playerState.isPlaying,
		order: $playerState.order,
		progressMs: $playerState.progressMs,
		repeatMode: $playerState.repeatMode,
		currentDevice: $playerState.currentDevice
	});

	let handleDeviceSelect = (device: Device) => {
		if (!device.id || device.isRestricted) return;
		$mDevices.mutate(device.id);
	};

	$effect(() => {
		if (!$rPlaybackState.data) return;
		untrack(() => {
			$playerState = {
				...$playerState,
				...toPlayerState($rPlaybackState.data)
			};
		});
	});
</script>

<!--  -->
<div class="relative flex flex-grow flex-col">
	<div class="fixed top-0 left-0 z-10">
		<Sidebar
			activeUrl={$page.url.pathname}
			buttonClass="m-4"
			constellations={$rConstellations.data ?? []}
			error={$rConstellations.error}
			isLoading={$rConstellations.isLoading}
			{open}
			{onOpen}
			{onClose}
		/>
	</div>

	<main class="relative z-1 flex flex-auto items-center justify-center p-4">
		<Canvas>
			<Scene>
				<Stars factor={30} depth={1000} speed={1} />
				{@render children()}
			</Scene>
		</Canvas>
	</main>

	<SpotifyPlayerBar
		className="fixed bottom-0 left-0 right-0 backdrop-blur-xs bg-gray-100/30 p-4 dark:bg-gray-900/30 z-5"
		devices={$rAvailableDevices.data ?? []}
		playerState={stateSlice}
		onDeviceSelect={handleDeviceSelect}
		{onPlayerStateChange}
	/>
</div>
