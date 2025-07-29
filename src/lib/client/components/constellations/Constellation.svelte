<script lang="ts">
	import ConstellationDagre from '$lib/client/components/constellations/ConstellationDagre.svelte';
	import type { Constellation, Star } from '$lib/types/constellations';

	interface Props {
		activeNodeId: string | null;
		constellation: Constellation;
		showNameplates: boolean;
		onStarButtonClick?: (star: Star) => void;
	}

	let { activeNodeId, constellation, showNameplates, onStarButtonClick }: Props = $props();
</script>

<ConstellationDagre {activeNodeId} {constellation} {showNameplates} {onStarButtonClick} />
