<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useThrelte } from '@threlte/core';

	import ForceGraph from '$lib/client/components/threlte-forcegraph/ForceGraph.svelte';
	import Star from './Star.svelte';
	import type { Edge as IEdge, Star as IStar } from '$lib/types/constellations';

	const { constellation } = $props();
	let lastTick = $state(0);

	const graph = $derived({
		nodes: constellation.stars.map((s: IStar) => ({ id: s.id })),
		links: constellation.edges.map((e: IEdge) => ({ source: e.sourceId, target: e.targetId }))
	});

	let graphRef = $state<ForceGraph | null>(null);
	useTask(() => {
		if (!graphRef) {
			return;
		}
		const now = Date.now();
		if (!lastTick || now - lastTick >= 100) {
			graphRef.tickFrame();
			lastTick = now;
		}
	});
</script>

<ForceGraph
	bind:graphRef
	graphData={graph}
	nodeColor="blue"
	linkColor="gray"
	linkDirectionalParticles={1}
	linkDirectionalParticleWidth={0.9}
	nodeThreeObject={Star}
	nodeRelSize={4}
	linkWidth={1}
/>
