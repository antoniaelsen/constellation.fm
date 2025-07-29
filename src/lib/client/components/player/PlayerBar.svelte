<script lang="ts">
	import { TrackLoop, TrackOrder } from '$lib/types/music';
	import PlayerControls, { type Props as PlayerControlsProps } from './PlayerControls.svelte';
	import TrackInfo from '../TrackInfo.svelte';

	export interface Props extends PlayerControlsProps {
		right?: any;
	}

	let {
		className,
		currentTrack = null,
		durationMs = 0,
		positionMs = 0,
		isPlaying = false,
		order = TrackOrder.LINEAR,
		repeatMode = TrackLoop.OFF,
		right,
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
				isLocal={currentTrack.isLocal}
			/>
		{/if}
	</div>

	<PlayerControls
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

	<div class="flex flex-1 justify-end">
		{#if right}
			{@render right()}
		{/if}
	</div>
</div>
