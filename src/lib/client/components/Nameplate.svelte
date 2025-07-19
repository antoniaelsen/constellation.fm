<script lang="ts">
	import type { EAlbumMetadata, EArtistMetadata } from '$lib/types/constellations';
	import { Card, type CardProps } from 'flowbite-svelte';
	import TrackInfo from './TrackInfo.svelte';

	interface Props extends Omit<CardProps, 'children'> {
		artists: EArtistMetadata[];
		album: EAlbumMetadata;
		className?: string;
		href: string;
		name: string;
	}

	let { name, href, artists, album, className, ...rest }: Props = $props();
</script>

<Card
	{...rest}
	class="flex w-max flex-row flex-nowrap overflow-hidden px-4 py-3 select-none {className}"
>
	<TrackInfo {name} {href} {artists} {album} />
</Card>
