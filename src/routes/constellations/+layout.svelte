<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { Stars } from '@threlte/extras';
	import { writable } from 'svelte/store';

	import { page } from '$app/stores';
	import { useAllConstellations } from '$lib/client/api/constellations';
	import Scene from '$lib/client/components/constellations/Scene.svelte';
	import { Provider } from '$lib/types/constellations';

	import Sidebar from './sidebar.svelte';

	let { children } = $props();

	let open = $state(true);

	function onOpen() {
		open = true;
	}

	function onClose() {
		open = false;
	}

	const req = useAllConstellations({ refetchOnWindowFocus: false, retry: false });
	// const req = writable({
	// 	data: CONSTELLATIONS,
	// 	error: null,
	// 	isLoading: false
	// });
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
				<Stars factor={30} depth={1000} speed={1} />
				{@render children()}
			</Scene>
		</Canvas>
	</main>
</div>
