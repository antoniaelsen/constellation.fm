<script lang="ts">
	import { Range } from 'flowbite-svelte';
	import VolumeOffIcon from 'virtual:icons/ic/baseline-volume-off';
	import VolumeDownIcon from 'virtual:icons/ic/baseline-volume-down';
	import VolumeUpIcon from 'virtual:icons/ic/baseline-volume-up';
	import GhostButton from './GhostButton.svelte';

	interface Props {
		isDisabled: boolean;
		volume: number;
		onVolumeChange: (volume: number) => void;
	}

	const { isDisabled, volume, onVolumeChange }: Props = $props();

	let previousVolume = $state(volume > 0 ? volume : 50);
	let debounceTimer: ReturnType<typeof setTimeout> | null = $state(null);

	$effect(() => {
		if (volume > 0) {
			previousVolume = volume;
		}
	});

	function debouncedVolumeChange(newVolume: number) {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			onVolumeChange(newVolume);
			debounceTimer = null;
		}, 300);
	}

	function handleVolumeToggle() {
		if (volume === 0) {
			debouncedVolumeChange(previousVolume);
		} else {
			debouncedVolumeChange(0);
		}
	}

	function handleVolumeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newVolume = parseInt(target.value);
		debouncedVolumeChange(newVolume);
	}
</script>

<div class="flex items-center gap-2">
	<GhostButton color="dark" disabled={isDisabled} onclick={handleVolumeToggle}>
		{#if volume === 0}
			<VolumeOffIcon class="h-5 w-5" />
		{:else if volume <= 33}
			<VolumeDownIcon class="h-5 w-5" />
		{:else}
			<VolumeUpIcon class="h-5 w-5" />
		{/if}
	</GhostButton>
	<Range
		color="gray"
		disabled={isDisabled}
		min="0"
		max="100"
		value={volume}
		class="w-20"
		oninput={handleVolumeChange}
	/>
</div>
