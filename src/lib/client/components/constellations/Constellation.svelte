<script lang="ts">
	import ConstellationDagre from '$lib/client/components/constellations/ConstellationDagre.svelte';

	let { activeNodeId, constellation } = $props();
</script>

<ConstellationDagre {activeNodeId} {constellation} />
