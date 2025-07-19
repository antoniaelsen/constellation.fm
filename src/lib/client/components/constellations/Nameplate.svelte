<script lang="ts">
	import type { EArtistMetadata } from '$lib/types/constellations';
	import { A, Avatar, Card, P, type CardProps } from 'flowbite-svelte';

	interface Props extends Omit<CardProps, 'children'> {
		className?: string;
		name: string;
		href: string;
		artists: EArtistMetadata[];
	}

	let { name, href, artists, className, ...rest }: Props = $props();
</script>

<Card
	{...rest}
	class="flex w-max flex-row flex-nowrap items-center justify-start gap-3 overflow-hidden px-4 py-3 {className}"
>
	<Avatar src="https://placecats.com/300/200" cornerStyle="rounded" class="pointer-events-none" />

	<div class="flex flex-col">
		<A class="text-gray-900 hover:no-underline dark:text-gray-100" size="md" {href}>
			{name}
		</A>

		<div class="flex flex-row flex-nowrap items-center justify-start gap-1">
			{#each artists as artist}
				<div
					class="flex-inherit flex flex-row flex-nowrap items-center justify-start gap-0 overflow-hidden text-gray-500 dark:text-gray-500"
				>
					<A
						class="text-ellipsis whitespace-nowrap text-inherit dark:text-inherit"
						size="sm"
						href={artist.href}
					>
						{artist.name}
					</A>
					{#if artist !== artists[artists.length - 1]}
						<P class="text-inherit dark:text-inherit">,</P>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Card>
