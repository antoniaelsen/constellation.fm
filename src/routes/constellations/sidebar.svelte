<script lang="ts">
	import { Provider, type Constellation } from '$lib/types/constellations';
	import { Avatar, Button, Drawer, Hr, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
	import { ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import SortDropdown from '$lib/client/components/sort-dropdown.svelte';
	import Search from '$lib/client/components/search.svelte';
	import Skeleton from '$lib/client/components/skeleton.svelte';
	import { SortOrder } from '$lib/types';

	interface Props {
		activeUrl: string;
		buttonClass?: string;
		drawerClass?: string;
		constellations: Constellation[];
		error?: any;
		isLoading?: boolean;
		open: boolean;
		showProviderIcon?: boolean;
		onClose: () => void;
		onOpen: () => void;
	}

	let {
		activeUrl,
		buttonClass = '',
		drawerClass = '',
		constellations = [],
		error,
		isLoading = false,
		open,
		showProviderIcon = false,
		onClose,
		onOpen
	}: Props = $props();

	const providerIcons: Record<Provider, string> = {
		[Provider.SPOTIFY]: '/icons/spotify/Primary_Logo_Green_PMS_C.svg'
	};

	let filter = $state('');
	let sort = $state('Alphabetical');
	let order = $state<SortOrder>(SortOrder.ASCENDING);
	let collapsed = $state<'filter' | 'sort'>('sort');
	const sortOptions = [
		{ label: 'Alphabetical', value: 'Alphabetical' },
		{ label: 'Recently Added', value: 'Recently Added', isDisabled: true }
	];

	function onOrderChange(update: SortOrder) {
		order = update;
	}

	function onSortChange(update: string) {
		sort = update;
	}

	let items = $derived(
		constellations?.map((constellation: Constellation) => ({
			name: constellation.metadata?.name || '',
			image: constellation.metadata?.images[0]?.url || '',
			href: `/constellations/${constellation.id}`,
			current: activeUrl === `/constellations/${constellation.id}`,
			providerIcon: providerIcons[constellation.provider]
		})) || []
	);

	let results = $derived(() => {
		const filtered = items.filter((item) =>
			item.name.toLowerCase().includes((filter || '').toLowerCase())
		);
		let sorted = [...filtered];

		if (sort === 'Alphabetical') {
			sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sort === 'Recently Added') {
		}

		const ordered = order === SortOrder.DESCENDING ? sorted.reverse() : sorted;

		return ordered;
	});
</script>

<Button
	aria-label="Open sidebar"
	class={`border-0 px-3 ${buttonClass}`}
	onclick={onOpen}
	hidden={open}><ChevronRightOutline /></Button
>

<Drawer
	id="sidebar"
	activateClickOutside={false}
	backdrop={false}
	hidden={!open}
	class={`bg-opacity-50 ${drawerClass}`}
	backdropClass="pointer-events-none"
>
	<div class="flex items-center justify-between">
		<P>constellation.fm</P>
		<Button aria-label="Close sidebar" class="border-0 px-3" outline onclick={onClose}
			><ChevronLeftOutline /></Button
		>
	</div>

	<Hr class="my-2" />

	<div class="mb-3 flex items-center justify-between">
		<Search
			size="md"
			clearable
			collapsed={collapsed === 'filter'}
			bind:value={filter}
			onClick={() => (collapsed = 'sort')}
		/>
		<SortDropdown
			{order}
			{sort}
			collapsed={collapsed === 'sort'}
			options={sortOptions}
			{onOrderChange}
			{onSortChange}
			onClick={() => (collapsed = 'filter')}
		/>
	</div>

	<div class="max-h-[calc(100vh-100px)] w-full overflow-y-auto">
		<Listgroup border={false} rounded={false} class="w-full overflow-x-hidden">
			{#if isLoading}
				{#each Array(100) as _}
					<ListgroupItem class="w-full items-stretch divide-y-0 overflow-hidden border-b-0 px-0">
						<Skeleton
							class="mb-1/2 h-6 flex-initial!"
							style="width: {Math.floor(Math.random() * 71 + 30)}%"
						/>
					</ListgroupItem>
				{/each}
			{/if}

			{#if !isLoading && error}
				<P>Error: {error?.message}</P>
			{/if}

			{#each results() as item}
				<ListgroupItem
					active={item.current}
					class="hover:text-primary-700 active:text-primary-800 w-full items-stretch divide-y-0 overflow-hidden border-b-0 px-0 dark:active:text-white"
					href={item.href}
				>
					<div class="flex flex-grow items-start justify-between gap-3 overflow-hidden">
						<Avatar class="flex-shrink-0" size="xs" src={item.image || ''} />
						<P
							class="b flex-shrink flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-inherit dark:text-inherit"
							>{item.name}</P
						>

						{#if showProviderIcon && item.providerIcon}
							<Avatar class="flex-shrink-0 self-end opacity-50" size="xs" src={item.providerIcon} />
						{/if}
					</div>
				</ListgroupItem>
			{/each}
		</Listgroup>
	</div>
</Drawer>
