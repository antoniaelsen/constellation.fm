<script lang="ts">
	import type { EAlbumMetadata, EArtistMetadata } from '$lib/types/constellations';
	import { Button, Card, type CardProps } from 'flowbite-svelte';
	import TrackInfo from './TrackInfo.svelte';
	import { PauseSolid, PlaySolid } from 'flowbite-svelte-icons';

	interface Props extends Omit<CardProps, 'children'> {
		artists: EArtistMetadata[];
		album: EAlbumMetadata;
		className?: string;
		href: string;
		index: number;
		isActive?: boolean;
		name: string;
		onpointerenter?: () => void;
		onpointerleave?: () => void;
	}

	let hovered = $state(false);

	let {
		name,
		href,
		artists,
		album,
		className,
		index,
		isActive,
		onpointerenter,
		onpointerleave,
		...rest
	}: Props = $props();
</script>

<Card
	{...rest}
	class="flex w-max flex-row flex-nowrap items-center overflow-hidden px-4 py-3 select-none {className}"
	onpointerenter={() => {
		hovered = true;
		onpointerenter?.();
	}}
	onpointerleave={() => {
		hovered = false;
		onpointerleave?.();
	}}
>
	<div class="-ml-4 flex min-w-10 items-center justify-center">
		{#if hovered}
			<Button
				class=" border-none bg-transparent p-2! hover:border-none hover:bg-transparent!"
				color="dark"
				outline={true}
				pill={true}
				size="sm"
			>
				{#if isActive}
					<PauseSolid />
				{:else}
					<PlaySolid />
				{/if}
			</Button>
		{:else}
			<p class="text-sm text-gray-500">{index + 1}</p>
		{/if}
	</div>

	<TrackInfo {name} {href} {artists} {album} />
</Card>
