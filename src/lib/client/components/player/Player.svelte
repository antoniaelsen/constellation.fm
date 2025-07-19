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
		currentTrack: PlaybackTrackInfo;
		duration: number;
		position: number;
		isActive: boolean;
		isPaused: boolean;
		onNextTrack: () => void;
		onPreviousTrack: () => void;
		onSeek: (position: number) => void;
		onTogglePlay: () => void;
	}

	let {
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

	let isValid = $derived(!!currentTrack && duration > 0);
</script>

<div class="flex flex-grow flex-col gap-3">
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
		<Button class="p-2!" color="green" pill={true} size="sm" onclick={() => onTogglePlay()}>
			{#if isPaused}
				<PlaySolid />
			{:else}
				<PauseSolid />
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
		{#if currentTrack && duration > 0}
			<span class="w-9 text-center text-xs text-gray-500">
				{Math.floor(position / 1000 / 60)}:{String(Math.floor(position / 1000) % 60).padStart(
					2,
					'0'
				)}
			</span>
		{:else}
			<span class="w-9"></span>
		{/if}
		<Range
			min="0"
			disabled={!isValid}
			id="seek"
			max={duration || 100}
			value={duration > 0 ? position : 0}
			class="flex-grow {!isValid ? 'opacity-50' : ''}"
			oninput={(e: any) => {
				if (currentTrack && duration > 0) {
					const newPosition = parseInt(e.target.value);
					onSeek(newPosition);
				}
			}}
		/>
		{#if isValid}
			<span class="w-9 text-center text-xs text-gray-500">
				{Math.floor(duration / 1000 / 60)}:{String(Math.floor(duration / 1000) % 60).padStart(
					2,
					'0'
				)}
			</span>
		{:else}
			<span class="w-9"></span>
		{/if}
	</div>
</div>
