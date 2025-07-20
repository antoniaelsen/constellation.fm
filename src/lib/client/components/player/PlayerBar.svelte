<script lang="ts">
	import Player, { type Props as PlayerProps } from './Player.svelte';
	import TrackInfo from '../TrackInfo.svelte';
	import type { CardProps } from 'flowbite-svelte';

	export interface Props extends PlayerProps {
		className?: string;
	}

	let {
		className,
		currentTrack = null,
		duration = 0,
		position = 0,
		isActive = false,
		isPaused = true,
		onNextTrack,
		onPreviousTrack,
		onSeek,
		onTogglePlay
	}: Props = $props();

	$inspect(currentTrack);
</script>

<div class={`flex items-center gap-8 p-4`}>
	<div class="flex-1">
		{#if currentTrack}
			<TrackInfo
				name={currentTrack.name}
				artists={currentTrack.artists}
				album={currentTrack.album}
			/>
		{/if}
	</div>

	<Player
		{currentTrack}
		{duration}
		{position}
		{isActive}
		{isPaused}
		{onSeek}
		{onTogglePlay}
		{onPreviousTrack}
		{onNextTrack}
	/>

	<div class="flex-1"></div>
</div>
