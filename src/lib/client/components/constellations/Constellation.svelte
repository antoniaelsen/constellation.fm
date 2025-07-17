<script lang="ts">
	import ConstellationDagre from '$lib/client/components/constellations/ConstellationDagre.svelte';
	import type { Constellation } from '$lib/types/constellations';

	interface Props {
		activeNodeId: string | null;
		constellation: Constellation;
	}

	let { activeNodeId, constellation }: Props = $props();
</script>

<ConstellationDagre {activeNodeId} {constellation} />
