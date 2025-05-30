<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Heading } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	import { useConstellation } from '$lib/client/api/constellations';
	import { page } from '$app/stores';
	import { Provider } from '$lib/types/constellations';
	import Scene from './scene.svelte';

	// const req = useConstellation($page.params.constellationId, { retry: false });
	const req = $derived(
		writable({
			data: {
				id: $page.params.constellationId,
				userId: '1',
				provider: Provider.SPOTIFY,
				providerPlaylistId: '1',
				stars: Array.from({ length: 10 }, (_, i) => ({
					id: i.toString(),
					constellationId: $page.params.constellationId,
					provider: Provider.SPOTIFY,
					providerTrackId: i.toString(),
					providerOrder: i.toString(),
					isrc: `ISRC-${i}`,
					metadata: {
						name: `Track ${i}`
					}
				})),
				edges: Array.from({ length: 9 }, (_, i) => ({
					id: i.toString(),
					constellationId: $page.params.constellationId,
					sourceId: i.toString(),
					targetId: (i + 1).toString()
				})),
				metadata: {
					name: 'Playlist ' + $page.params.constellationId,
					images: [],
					owners: []
				}
			},
			error: null,
			isLoading: false
		})
	);

	$effect(() => {
		console.log('Constellation data:', $req);
	});
</script>

<div class="flex h-screen items-center justify-center p-4">
	<Heading
		class="absolute top-16 left-1/2 max-w-3/4 -translate-x-1/2 overflow-hidden text-ellipsis opacity-75 transition-opacity duration-200 hover:opacity-100"
		>{$req.data?.metadata?.name}</Heading
	>

	<Canvas>
		<Scene />
	</Canvas>
</div>
