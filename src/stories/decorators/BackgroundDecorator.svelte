<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="h-full w-full bg-gray-100 p-2 dark:bg-gray-900">
	{@render children?.()}
</div>
