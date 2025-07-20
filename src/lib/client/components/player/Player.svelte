<script lang="ts">
	import { Button, Range } from 'flowbite-svelte';
	import {
		PlaySolid,
		PauseSolid,
		ForwardStepSolid,
		BackwardStepSolid
	} from 'flowbite-svelte-icons';

	export interface PlaybackTrackInfo {
		name: string;
		artists: { name: string }[];
		album: {
			name: string;
			images: { url: string }[];
		};
	}

	export interface Props {
		className?: string;
		currentTrack: PlaybackTrackInfo | null;
		duration?: number;
		position?: number;
		isActive?: boolean;
		isPaused?: boolean;
		onNextTrack: () => void;
		onPreviousTrack: () => void;
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
		onTogglePlay,
		onSeek,
		onPreviousTrack,
		onNextTrack
	}: Props = $props();

	let isValid = $derived(!!currentTrack && !!duration && !!position);
</script>

<div class={`flex flex-grow flex-col gap-3 ${className}`}>
	<div class="flex justify-center gap-2">
		<Button
			class="border-none p-2! hover:border-none hover:bg-transparent"
			color="dark"
			outline={true}
			pill={true}
			size="sm"
			onclick={() => onPreviousTrack()}
		>
			<BackwardStepSolid />
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
				<PlaySolid color="dark" />
			{:else}
				<PauseSolid color="dark" />
			{/if}
		</Button>
		<Button
			class="border-none p-2! hover:border-none hover:bg-transparent"
			color="dark"
			outline={true}
			pill={true}
			size="sm"
			onclick={() => onNextTrack()}
		>
			<ForwardStepSolid />
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
