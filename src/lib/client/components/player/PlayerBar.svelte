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
		isActive = false,
		isPaused = true,
		loop,
		order,
		position = 0,
		onNextTrack,
		onPreviousTrack,
		onSeek,
		onTogglePlay,
		onToggleOrder,
		onToggleLoop
	}: Props = $props();
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
		{isActive}
		{isPaused}
		{loop}
		{order}
		{position}
		{onNextTrack}
		{onPreviousTrack}
		{onSeek}
		{onToggleLoop}
		{onToggleOrder}
		{onTogglePlay}
	/>

	<div class="flex-1"></div>
</div>
