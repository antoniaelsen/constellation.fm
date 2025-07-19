<script lang="ts">
	import Player, { type Props as PlayerProps } from './Player.svelte';
	import TrackInfo from '../TrackInfo.svelte';

	interface Props extends PlayerProps {}

	let {
		currentTrack,
		duration,
		position,
		isActive,
		isPaused,
		onNextTrack,
		onPreviousTrack,
		onSeek,
		onTogglePlay
	}: Props = $props();

	$inspect(currentTrack);
</script>

<div class="flex items-center gap-8 p-4">
	{#if currentTrack}
		<TrackInfo name={currentTrack.name} artists={currentTrack.artists} album={currentTrack.album} />
	{/if}

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
</div>
