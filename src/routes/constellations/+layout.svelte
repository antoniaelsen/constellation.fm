<script lang="ts">
	import Sidebar from './sidebar.svelte';

	import { page } from '$app/stores';

	let { children } = $props();

	let open = $state(false);
	let constellations = $state(
		Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Constellation ${i}` }))
	);

	function onOpen() {
		open = true;
	}

	function onClose() {
		open = false;
	}
</script>

<div class="relative">
	<div class="fixed top-0 left-0">
		<Sidebar
			activeUrl={$page.url.pathname}
			buttonClass="m-4"
			{constellations}
			{open}
			{onOpen}
			{onClose}
		/>
	</div>
	<main class="min-h-screen">
		{@render children()}
	</main>
</div>
