<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { page } from '$app/stores';
</script>

<div class="flex h-screen items-center justify-center p-4">
	<Heading class="absolute top-16 left-1/2 -translate-x-1/2"
		>Constellation {$page.params.constellationId}</Heading
	>
</div>
