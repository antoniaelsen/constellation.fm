<script lang="ts">
	import type { EAlbumMetadata, EArtistMetadata } from '$lib/types/music';
	import { Card } from 'flowbite-svelte';
	import TrackInfo from './TrackInfo.svelte';
	import { PauseSolid, PlaySolid } from 'flowbite-svelte-icons';
	import GhostButton from './GhostButton.svelte';

	interface Props {
		className?: string;

		artists: EArtistMetadata[];
		album: EAlbumMetadata | null;
		href: string;
		index: number;
		isActive?: boolean;
		isLocal: boolean;
		name: string;

		onClick?: () => void;
		onButtonClick?: () => void;
		onPointerEnter?: () => void;
		onPointerLeave?: () => void;
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
		isLocal,
		onClick,
		onButtonClick,
		onPointerEnter,
		onPointerLeave,
	}: Props = $props();
</script>

<Card
	class="flex w-max flex-row flex-nowrap items-center overflow-hidden px-4 py-3 select-none {className}"
	onclick={() => {
		onClick?.();
	}}
	onpointerenter={() => {
		hovered = true;
		onPointerEnter?.();
	}}
	onpointerleave={() => {
		hovered = false;
		onPointerLeave?.();
	}}
>
	<div class="-ml-4 flex min-w-10 items-center justify-center">
		{#if hovered}
			<!-- use pointer events en lieu of click for threlte support -->
			<GhostButton
				color="dark"
				disabled={isLocal}
				outline={true}
				pill={true}
				size="sm"
				onpointerdown={(e: MouseEvent) => {
					e.stopPropagation();
					onButtonClick?.();
				}}
			>
				{#if isActive}
					<PauseSolid />
				{:else}
					<PlaySolid />
				{/if}
			</GhostButton>
		{:else}
			<p class="text-sm text-gray-500">{index + 1}</p>
		{/if}
	</div>

	<TrackInfo {name} {href} {artists} {album} {isLocal} />
</Card>
