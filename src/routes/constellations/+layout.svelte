<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Stars } from '@threlte/extras';

	import { page } from '$app/stores';
	import { useAllConstellations } from '$lib/client/api/constellations';
	import { usePlaybackState } from '$lib/client/api/spotify';
	import Scene from '$lib/client/components/constellations/Scene.svelte';
	import SpotifyPlayerBar from '$lib/client/components/player/SpotifyPlayerBar.svelte';
	import { playerState, toPlayerState } from '$lib/client/stores/player';
	import { TrackLoop, TrackOrder, type PlaybackTrackInfo } from '$lib/types/constellations';

	import Sidebar from './sidebar.svelte';
	import type { PlaybackState } from '@spotify/web-api-ts-sdk';

	let { children } = $props();

	let open = $state(true);

	const onClose = () => {
		open = false;
	};

	const onOpen = () => {
		open = true;
	};

	const onPlayerStateChange = (update: {
		deviceId?: string | null;
		isPlaying?: boolean;
		repeatMode?: TrackLoop;
		order?: TrackOrder;
		durationMs?: number | null;
		progressMs?: number | null;
		window?: {
			current: PlaybackTrackInfo | null;
			next: PlaybackTrackInfo | null;
			previous: PlaybackTrackInfo | null;
		};
	}) => {
		$playerState = {
			...$playerState,
			...update,
			window: {
				...$playerState.window,
				...update.window
			}
		};
	};

	const rConstellations = useAllConstellations({ refetchOnWindowFocus: false, retry: false });
	const rPlaybackState = usePlaybackState({
		refetchOnWindowFocus: false,
		retry: false,
		refetchInterval: 5000,
		onSuccess: (data: PlaybackState) => {
			if (!data) return;
			$playerState = {
				...$playerState,
				...toPlayerState(data)
			};
		}
	});

	let stateSlice = $derived({
		currentTrack: $playerState.window.current,
		deviceId: $playerState.deviceId,
		durationMs: $playerState.durationMs,
		isPlaying: $playerState.isPlaying,
		order: $playerState.order,
		progressMs: $playerState.progressMs,
		repeatMode: $playerState.repeatMode
	});

	$inspect($rPlaybackState.data).with((type, value) =>
		console.log(type, '(layout) $rPlaybackState.data', value)
	);
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
		playerState={stateSlice}
		{onPlayerStateChange}
	/>
</div>
