<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { writable } from 'svelte/store';

	import { useAllConstellations } from '$lib/client/api/constellations';
	import { Provider } from '$lib/types/constellations';
	import Sidebar from './sidebar.svelte';
	import Scene from './[constellationId]/Scene.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let open = $state(true);

	function onOpen() {
		open = true;
	}

	function onClose() {
		open = false;
	}

	// const req = useAllConstellations({ refetchOnWindowFocus: false, retry: false });
	const req = writable({
		data: Array.from({ length: 10 }, (_, i) => ({
			id: i.toString(),
			userId: i.toString(),
			provider: Provider.SPOTIFY,
			providerPlaylistId: i.toString(),
			stars: Array.from({ length: 20 }, (_, s) => ({
				id: s.toString(),
				constellationId: i.toString(),
				provider: Provider.SPOTIFY,
				providerTrackId: s.toString(),
				providerOrder: s.toString(),
				isrc: `ISRC-${s}`,
				metadata: {
					name: `Track ${s}`
				}
			})),
			edges: Array.from({ length: 19 }, (_, e) => ({
				id: e.toString(),
				constellationId: i.toString(),
				sourceId: e.toString(),
				targetId: (e + 1).toString()
			})),
			metadata: {
				name: `Playlist ${i}`,
				images: [],
				owners: []
			}
		})),
		error: null,
		isLoading: false
	});
</script>

<!--  -->
<div class="relative">
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
	<main class="z-1 flex h-screen items-center justify-center p-4">
		<Canvas>
			<Scene>
				{@render children()}
			</Scene>
		</Canvas>
	</main>
</div>
