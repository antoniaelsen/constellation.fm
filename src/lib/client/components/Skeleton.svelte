<script lang="ts">
	interface Props {
		class?: string;
		style?: string;
	}

	let { class: className = '', style }: Props = $props();
</script>

<div
	role="status"
	class="mb-1/2 h-6 w-full max-w-sm flex-shrink flex-grow animate-pulse overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 {className}"
	{style}
></div>
