<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { useConstellation } from '$lib/client/api/constellations';

	const req = useConstellation($page.params.constellationId);
	$inspect($req.data);
</script>

<div class="flex h-screen items-center justify-center p-4">
	<Heading
		class="absolute top-16 left-1/2 max-w-3/4 -translate-x-1/2 overflow-hidden text-ellipsis opacity-75 transition-opacity duration-200 hover:opacity-100"
		>{$req.data?.metadata?.name}</Heading
	>
</div>
