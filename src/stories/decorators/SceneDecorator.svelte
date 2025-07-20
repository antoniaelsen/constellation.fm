<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/client/components/constellations/Scene.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="relative h-full w-full">
	<Canvas>
		<Scene>
			{@render children?.()}
		</Scene>
	</Canvas>
</div>
