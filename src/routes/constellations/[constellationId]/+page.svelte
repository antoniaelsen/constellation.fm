<script lang="ts">
	import { useConstellation } from '$lib/client/api/constellations';
	import { page } from '$app/stores';
	import Constellation from '$lib/client/components/constellations/Constellation.svelte';

	const req = $derived(
		useConstellation($page.params.constellationId, { retry: false, refetchOnWindowFocus: false })
	);
	$inspect($page.params.constellationId);
	$inspect($req.data);

	// let stars = $derived(
	// 	Array.from({ length: N_STARS }, (_, i) => ({
	// 		id: i.toString(),
	// 		constellationId: $page.params.constellationId,
	// 		provider: Provider.SPOTIFY,
	// 		providerTrackId: i.toString(),
	// 		providerOrder: i.toString(),
	// 		isrc: `ISRC-${i}`,
	// 		metadata: {
	// 			name: `Track ${i}`,
	// 			artists: Array.from({ length: 3 }, (_, j) => ({
	// 				name: `Artist ${i}-${j}`,
	// 				href: `https://artist.com/${i}-${j}`
	// 			}))
	// 		}
	// 	}))
	// );
</script>

{#if $req.data}
	<Constellation activeNodeId={'0'} constellation={$req.data} />
{/if}
