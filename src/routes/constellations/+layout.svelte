<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Stars } from '@threlte/extras';

	import { page } from '$app/stores';
	import { useAllConstellations } from '$lib/client/api/constellations';
	import Scene from '$lib/client/components/constellations/Scene.svelte';

	import Sidebar from './sidebar.svelte';
	import SpotifyPlayerBar from '$lib/client/components/player/SpotifyPlayerBar.svelte';

	let { children } = $props();

	let open = $state(true);

	function onOpen() {
		open = true;
	}

	function onClose() {
		open = false;
	}

	const req = useAllConstellations({ refetchOnWindowFocus: false, retry: false });
</script>

<!--  -->
<div class="relative flex flex-grow flex-col">
	<div class="fixed top-0 left-0 z-10">
		<Sidebar
			activeUrl={$page.url.pathname}
			buttonClass="m-4"
			constellations={$req.data ?? []}
			error={$req.error}
			isLoading={$req.isLoading}
			{open}
			{onOpen}
			{onClose}
		/>
	</div>
	<main class="z-1 flex flex-auto items-center justify-center p-4">
		<Canvas>
			<Scene>
				<Stars factor={30} depth={1000} speed={1} />
				{@render children()}
			</Scene>
		</Canvas>
	</main>

	<SpotifyPlayerBar className="flex-initial" />
</div>
