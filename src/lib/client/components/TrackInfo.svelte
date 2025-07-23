<script lang="ts">
	import type { EAlbumMetadata, EArtistMetadata } from '$lib/types/constellations';
	import { A, Avatar, P } from 'flowbite-svelte';

	interface Props {
		album?: EAlbumMetadata;
		artists: EArtistMetadata[];
		href?: string;
		name: string;
	}

	let { name, href, artists, album }: Props = $props();
</script>

<div class="flex flex-row flex-nowrap items-center justify-start gap-3">
	<Avatar src={album?.images[0]?.url} cornerStyle="rounded" class="pointer-events-none" />

	<div class="flex flex-col">
		<A
			class="text-sm text-ellipsis whitespace-nowrap text-gray-900 select-none hover:no-underline dark:text-gray-100"
			{href}
		>
			{name}
		</A>

		<div class="flex flex-row flex-nowrap items-center justify-start gap-1">
			{#each artists as artist}
				<div
					class="flex-inherit flex flex-row flex-nowrap items-center justify-start gap-0 overflow-hidden text-gray-500 dark:text-gray-500"
				>
					<A
						class="text-xs text-ellipsis whitespace-nowrap text-inherit select-none dark:text-inherit"
						href={artist.href}
					>
						{artist.name}
					</A>
					{#if artist !== artists[artists.length - 1]}
						<P class="text-xs text-inherit select-none dark:text-inherit">,&nbsp;</P>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
