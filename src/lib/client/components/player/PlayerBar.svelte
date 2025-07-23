<script lang="ts">
	import { TrackLoop, TrackOrder } from '$lib/types/constellations';
	import Player, { type Props as PlayerProps } from './Player.svelte';
	import TrackInfo from '../TrackInfo.svelte';

	export interface Props extends PlayerProps {}

	let {
		className,
		currentTrack = null,
		durationMs = 0,
		positionMs = 0,
		isPlaying = false,
		order = TrackOrder.LINEAR,
		repeatMode = TrackLoop.OFF,
		onNextTrack,
		onPreviousTrack,
		onSeek,
		onTogglePlay,
		onToggleOrder,
		onToggleLoop
	}: Props = $props();
</script>

<div class={`flex items-center gap-8 ${className}`}>
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
		{durationMs}
		{isPlaying}
		{order}
		{positionMs}
		{repeatMode}
		{onNextTrack}
		{onPreviousTrack}
		{onSeek}
		{onToggleLoop}
		{onToggleOrder}
		{onTogglePlay}
	/>

	<div class="flex-1"></div>
</div>
