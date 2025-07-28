<script lang="ts">
	import { Button, Search, type SearchProps } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { fadeIn } from './transitions';

	interface Props extends SearchProps {
		collapsed?: boolean;
		onClick?: () => void;
	}

	let { collapsed = false, size = 'md', value = $bindable(), onClick }: Props = $props();
</script>

<div class="flex items-center">
	{#if collapsed}
		<div in:fadeIn={{ duration: 300 }}>
			<Button pill={true} outline={true} class="border-none! p-2!" onclick={onClick}>
				<SearchOutline />
			</Button>
		</div>
	{:else}
		<div in:fadeIn={{ duration: 300 }}>
			<Search {size} clearable bind:value />
		</div>
	{/if}
</div>
