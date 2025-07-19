<script lang="ts">
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';
	import { ChevronUpOutline, ChevronDownOutline, SortOutline } from 'flowbite-svelte-icons';
	import { SortOrder } from '$lib/types';

	interface Props {
		collapsed?: boolean;
		options: { label: string; value: string; isDisabled?: boolean }[];
		order: SortOrder;
		sort: string;
		onClick: () => void;
		onOrderChange: (order: SortOrder) => void;
		onSortChange: (sort: string) => void;
	}

	let {
		collapsed = false,
		sort,
		options,
		order,
		onClick,
		onSortChange,
		onOrderChange
	}: Props = $props();
</script>

<div class="flex items-center">
	<Button
		class="w-full justify-between bg-transparent p-3 {!collapsed
			? 'rounded-r-none'
			: 'border-none'} focus:ring-0"
		outline={collapsed}
		onclick={onClick}
	>
		{#if !collapsed}
			{sort}
		{:else}
			<SortOutline class={{ 'ms-2': !collapsed }} {order} />
		{/if}
	</Button>
	<Dropdown class="w-48" simple>
		{#each options as option}
			<DropdownItem
				class="w-full text-left {option.isDisabled
					? 'opacity-50 hover:bg-transparent dark:hover:bg-transparent'
					: ''}"
				disabled={option.isDisabled}
				onclick={() => (option.isDisabled ? null : onSortChange(option.value))}
			>
				{option.label}
			</DropdownItem>
		{/each}
	</Dropdown>

	{#if !collapsed}
		<Button
			onclick={() =>
				onOrderChange(order === SortOrder.ASCENDING ? SortOrder.DESCENDING : SortOrder.ASCENDING)}
			class="p-3 {!collapsed ? 'rounded-l-none' : ''} focus:ring-0"
		>
			{#if order === SortOrder.ASCENDING}
				<ChevronUpOutline />
			{:else}
				<ChevronDownOutline />
			{/if}
		</Button>
	{/if}
</div>
