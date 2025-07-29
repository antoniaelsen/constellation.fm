<script lang="ts">
	import { TrackLoop, type PlaybackTrackInfo, TrackOrder } from '$lib/types/music';
	import PlayArrow from 'virtual:icons/ic/baseline-play-arrow';
	import Pause from 'virtual:icons/ic/baseline-pause';
	import SkipNext from 'virtual:icons/ic/baseline-skip-next';
	import SkipPrevious from 'virtual:icons/ic/baseline-skip-previous';
	import Repeat from 'virtual:icons/ic/baseline-repeat';
	import RepeatOne from 'virtual:icons/ic/baseline-repeat-one';
	import Shuffle from 'virtual:icons/ic/baseline-shuffle';
	import { Button, Range } from 'flowbite-svelte';
	import GhostButton from '../GhostButton.svelte';

	export interface Props {
		className?: string;
		currentTrack: PlaybackTrackInfo | null;
		durationMs?: number | null;
		positionMs?: number | null;
		isPlaying?: boolean;
		order?: TrackOrder;
		repeatMode?: TrackLoop;
		onNextTrack: () => void;
		onPreviousTrack: () => void;
		onToggleOrder: () => void;
		onToggleLoop: () => void;
		onSeek: (position: number) => void;
		onTogglePlay: () => void;
	}

	let {
		className,
		currentTrack,
		durationMs,
		positionMs,
		isPlaying,
		order,
		repeatMode,
		onNextTrack,
		onSeek,
		onPreviousTrack,
		onToggleLoop,
		onToggleOrder,
		onTogglePlay
	}: Props = $props();

	let isValid = $derived(!!currentTrack && !!durationMs && positionMs !== null);
</script>

<div class={`flex flex-grow flex-col gap-3  ${className}`}>
	<div class="flex justify-center gap-2">
		<GhostButton
			color={order === TrackOrder.SHUFFLE ? 'green' : 'dark'}
			pill={true}
			size="sm"
			onclick={() => onToggleOrder()}
		>
			<Shuffle />
		</GhostButton>

		<GhostButton color="dark" pill={true} size="sm" onclick={() => onPreviousTrack()}>
			<SkipPrevious />
		</GhostButton>
		<Button
			class="p-2!"
			color="green"
			disabled={!isValid}
			pill={true}
			size="sm"
			onclick={() => onTogglePlay()}
		>
			{#if isPlaying}
				<Pause color="dark" />
			{:else}
				<PlayArrow color="dark" />
			{/if}
		</Button>
		<GhostButton color="dark" pill={true} size="sm" onclick={() => onNextTrack()}>
			<SkipNext />
		</GhostButton>
		<GhostButton
			color={repeatMode === TrackLoop.OFF ? 'dark' : 'green'}
			pill={true}
			size="sm"
			onclick={() => onToggleLoop()}
		>
			{#if repeatMode === TrackLoop.OFF}
				<Repeat />
			{:else if repeatMode === TrackLoop.CONTEXT}
				<Repeat />
			{:else}
				<RepeatOne />
			{/if}
		</GhostButton>
	</div>

	<div class="flex items-center gap-3">
		<span class="w-9 text-center text-xs text-xs text-gray-500">
			{#if currentTrack && !!durationMs && !!positionMs}
				{Math.floor(positionMs / 1000 / 60)}:{String(Math.floor(positionMs / 1000) % 60).padStart(
					2,
					'0'
				)}
			{:else}
				0:00
			{/if}
		</span>
		<Range
			min="0"
			disabled={!isValid}
			id="seek"
			max={durationMs || 100}
			value={positionMs || 0}
			class="flex-grow {!isValid ? 'opacity-50' : ''}"
			oninput={(e: any) => {
				if (currentTrack && !!durationMs) {
					const newPosition = parseInt(e.target.value);
					onSeek(newPosition);
				}
			}}
		/>
		<span class="w-9 text-center text-xs text-xs text-gray-500">
			{#if isValid && !!durationMs}
				{Math.floor(durationMs / 1000 / 60)}:{String(Math.floor(durationMs / 1000) % 60).padStart(
					2,
					'0'
				)}
			{:else}
				0:00
			{/if}
		</span>
	</div>
</div>
