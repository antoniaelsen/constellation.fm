<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useThrelte } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';

	import ForceGraph from '$lib/client/components/threlte-forcegraph/ForceGraph.svelte';
	import Star from '../constellations/Star.svelte';

	const graphData = {
		nodes: [{ id: 'node1' }, { id: 'node2' }, { id: 'node3' }],
		links: [
			{ source: 'node1', target: 'node2' },
			{ source: 'node2', target: 'node3' }
		]
	};

	const { scene } = useThrelte();

	let graphRef = $state(null);

	useTask(() => {
		if (!graphRef) {
			return;
		}
		graphRef.tickFrame();
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[10, 10, 10]}
	oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} />

<ForceGraph
	bind:graphRef
	{graphData}
	nodeColor="blue"
	linkColor="gray"
	nodeRelSize={0.5}
	linkWidth={1}
/>
