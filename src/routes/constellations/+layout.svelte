<script lang="ts">
	import Sidebar from './sidebar.svelte';

	import { page } from '$app/stores';
	import { useAllConstellations } from '$lib/client/api/constellations';

	let { children } = $props();

	let open = $state(true);

	function onOpen() {
		open = true;
	}

	function onClose() {
		open = false;
	}

	const req = useAllConstellations({ refetchOnWindowFocus: false, retry: false });
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
	<main class="z-1">
		{@render children()}
	</main>
</div>
