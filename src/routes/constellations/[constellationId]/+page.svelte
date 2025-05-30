<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Heading } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	import { useConstellation } from '$lib/client/api/constellations';
	import { page } from '$app/stores';
	import { Provider } from '$lib/types/constellations';
	import Scene from './Scene.svelte';
	import Constellation from '$lib/client/components/constellations/Constellation.svelte';

	// const req = useConstellation($page.params.constellationId, { retry: false });

	let N_STARS = $derived(parseInt($page.params.constellationId, 10) * 25);
	$inspect($page.params.constellationId);
	let stars = $derived(
		Array.from({ length: N_STARS }, (_, i) => ({
			id: i.toString(),
			constellationId: $page.params.constellationId,
			provider: Provider.SPOTIFY,
			providerTrackId: i.toString(),
			providerOrder: i.toString(),
			isrc: `ISRC-${i}`,
			metadata: {
				name: `Track ${i}`,
				artists: Array.from({ length: 3 }, (_, j) => ({
					name: `Artist ${i}-${j}`,
					href: `https://artist.com/${i}-${j}`
				}))
			}
		}))
	);

	let connections = $derived(
		Array.from({ length: Math.floor(Math.random() * N_STARS) }, (_, i) => ({
			id: (N_STARS + i).toString(),
			constellationId: $page.params.constellationId,
			sourceId: stars[Math.floor(Math.random() * N_STARS)].id,
			targetId: stars[Math.floor(Math.random() * N_STARS)].id
		}))
	);
	const req = $derived(
		writable({
			data: {
				id: $page.params.constellationId,
				userId: '1',
				provider: Provider.SPOTIFY,
				providerPlaylistId: '1',
				stars,
				edges: [
					...Array.from({ length: N_STARS }, (_, i) => ({
						id: i.toString(),
						constellationId: $page.params.constellationId,
						sourceId: i.toString(),
						targetId: (i + 1 >= N_STARS ? 0 : i + 1).toString()
					})),
					...connections
				],
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
</script>

<!-- <div class="flex h-screen items-center justify-center p-4">
	<Heading
		class="absolute top-16 left-1/2 z-5 max-w-3/4 -translate-x-1/2 overflow-hidden text-ellipsis opacity-75 transition-opacity duration-200 hover:opacity-100"
		>{$req.data?.metadata?.name}</Heading
	>

	{#if $req.data}

		<Constellation {constellation} />
	{:else}
		<div>Loading...</div>
	{/if}
</div> -->
{#if $req.data}
	<Constellation activeNodeId={'0'} constellation={$req.data} />
{/if}
