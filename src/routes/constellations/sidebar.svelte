<script lang="ts">
	import { Button, Drawer, Hr, Listgroup, P } from 'flowbite-svelte';
	import { ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';

	let {
		activeUrl,
		buttonClass = '',
		drawerClass = '',
		constellations = [],
		open = false,
		onClose,
		onOpen
	} = $props();

	let items = $derived(
		constellations.map((constellation) => ({
			name: constellation.name,
			href: `/constellations/${constellation.id}`,
			current: activeUrl === `/constellations/${constellation.id}`
		}))
	);
</script>

<Button
	aria-label="Open sidebar"
	class={`border-0 px-3 ${buttonClass}`}
	onclick={onOpen}
	hidden={open}><ChevronRightOutline /></Button
>

<Drawer backdrop={false} hidden={!open} class={`opacity-75 ${drawerClass}`}>
	<div class="flex items-center justify-between">
		<P>constellation.fm</P>
		<Button aria-label="Close sidebar" class="border-0 px-3" outline onclick={onClose}
			><ChevronLeftOutline /></Button
		>
	</div>

	<Hr class="my-2" />

	<div class="max-h-[calc(100vh-100px)] w-full overflow-y-auto">
		<Listgroup
			{items}
			border={false}
			rounded={false}
			itemClass="w-full px-0 divide-y-0 border-b-0"
			class="w-full"
		/>
	</div>
</Drawer>
