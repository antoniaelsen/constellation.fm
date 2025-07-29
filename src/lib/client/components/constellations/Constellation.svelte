<script lang="ts">
	import ConstellationDagre from '$lib/client/components/constellations/ConstellationDagre.svelte';
	import type { Constellation, Star, Edge } from '$lib/types/constellations';

	interface Props {
		activeNodeId: string | null;
		constellation: Constellation;
		selectedNodeIds: string[];
		showNameplates: boolean;
		onStarButtonClick?: (star: Star) => void;
		onStarClick?: (star: Star, event: IntersectionEvent) => void;
		onEdgeRemove?: (edge: Edge) => void;
	}

	let {
		activeNodeId,
		constellation,
		selectedNodeIds,
		showNameplates,
		onStarButtonClick,
		onStarClick,
		onEdgeRemove
	}: Props = $props();
</script>

<ConstellationDagre
	{activeNodeId}
	{constellation}
	{selectedNodeIds}
	{showNameplates}
	{onStarButtonClick}
	{onStarClick}
	{onEdgeRemove}
/>
