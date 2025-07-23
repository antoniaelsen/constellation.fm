<script lang="ts">
	import { TrackLoop, type PlaybackTrackInfo, TrackOrder } from '$lib/types/constellations';
	import PlayArrow from 'virtual:icons/ic/baseline-play-arrow';
	import Pause from 'virtual:icons/ic/baseline-pause';
	import SkipNext from 'virtual:icons/ic/baseline-skip-next';
	import SkipPrevious from 'virtual:icons/ic/baseline-skip-previous';
	import Repeat from 'virtual:icons/ic/baseline-repeat';
	import RepeatOne from 'virtual:icons/ic/baseline-repeat-one';
	import Shuffle from 'virtual:icons/ic/baseline-shuffle';
	import { Button, Range } from 'flowbite-svelte';

	export interface Props {
		className?: string;
		currentTrack: PlaybackTrackInfo | null;
		duration?: number;
		position?: number;
		isActive?: boolean;
		isPaused?: boolean;
		loop: TrackLoop;
		order: TrackOrder;
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
		duration,
		position,
		isActive,
		isPaused,
		loop,
		order,
		onNextTrack,
		onSeek,
		onPreviousTrack,
		onToggleLoop,
		onToggleOrder,
		onTogglePlay
	}: Props = $props();

	let isValid = $derived(!!currentTrack && !!duration && !!position);
</script>

<div class={`flex flex-grow flex-col gap-3 ${className}`}>
	<div class="flex justify-center gap-2">
		<Button
			class="border-none p-2! hover:border-none hover:bg-transparent!"
			color={order === TrackOrder.SHUFFLE ? 'green' : 'dark'}
			outline={true}
			pill={true}
			size="sm"
			onclick={() => onToggleOrder()}
		>
			<Shuffle />
		</Button>

		<Button
			class="border-none p-2! hover:border-none hover:bg-transparent!"
			color="dark"
			outline={true}
			pill={true}
			size="sm"
			onclick={() => onPreviousTrack()}
		>
			<SkipPrevious />
		</Button>
		<Button
			class="p-2!"
			color="green"
			disabled={!isValid}
			pill={true}
			size="sm"
			onclick={() => onTogglePlay()}
		>
			{#if isPaused}
				<PlayArrow color="dark" />
			{:else}
				<Pause color="dark" />
			{/if}
		</Button>
		<Button
			class="border-none p-2! hover:border-none hover:bg-transparent!"
			color="dark"
			outline={true}
			pill={true}
			size="sm"
			onclick={() => onNextTrack()}
		>
			<SkipNext />
		</Button>
		<Button
			class="border-none p-2! hover:border-none hover:bg-transparent!"
			color={loop === TrackLoop.OFF ? 'dark' : 'green'}
			outline={true}
			pill={true}
			size="sm"
			onclick={() => onToggleLoop()}
		>
			{#if loop === TrackLoop.OFF}
				<Repeat />
			{:else if loop === TrackLoop.CONTEXT}
				<Repeat />
			{:else}
				<RepeatOne />
			{/if}
		</Button>
	</div>

	<div class="flex items-center gap-3">
		<span class="w-9 text-center text-xs text-xs text-gray-500">
			{#if currentTrack && !!duration && !!position}
				{Math.floor(position / 1000 / 60)}:{String(Math.floor(position / 1000) % 60).padStart(
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
			max={duration || 100}
			value={position || 0}
			class="flex-grow {!isValid ? 'opacity-50' : ''}"
			oninput={(e: any) => {
				if (currentTrack && !!duration) {
					const newPosition = parseInt(e.target.value);
					onSeek(newPosition);
				}
			}}
		/>
		<span class="w-9 text-center text-xs text-xs text-gray-500">
			{#if isValid && !!duration}
				{Math.floor(duration / 1000 / 60)}:{String(Math.floor(duration / 1000) % 60).padStart(
					2,
					'0'
				)}
			{:else}
				0:00
			{/if}
		</span>
	</div>
</div>
