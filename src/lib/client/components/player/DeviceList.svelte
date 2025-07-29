<script lang="ts">
	import type { Device, DeviceType } from '$lib/types/music';
	import { Button } from 'flowbite-svelte';
	import PhoneIcon from 'virtual:icons/ic/baseline-phone-iphone';
	import ComputerIcon from 'virtual:icons/ic/baseline-computer';
	import SpeakerIcon from 'virtual:icons/ic/baseline-speaker';

	interface Props {
		devices: Device[];
		onDeviceSelect?: (device: Device) => void;
	}

	let { devices, onDeviceSelect }: Props = $props();

	function getDeviceTypeLabel(type: DeviceType): string {
		switch (type) {
			case 'smartphone':
				return 'Smartphone';
			case 'computer':
				return 'Computer';
			case 'speaker':
				return 'Speaker';
			default:
				return 'Device';
		}
	}

	function handleDeviceClick(device: Device) {
		if (!!device.id && !device.isRestricted && onDeviceSelect) {
			onDeviceSelect(device);
		}
	}
</script>

<div class="flex flex-col gap-2">
	{#each devices as device (device.id)}
		<Button
			class="flex flex-row flex-nowrap items-center justify-start gap-3 p-3 {device.isActive
				? 'bg-green-100 dark:bg-green-900'
				: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'} {device.isRestricted
				? 'cursor-not-allowed opacity-50'
				: 'cursor-pointer'}"
			onclick={() => handleDeviceClick(device)}
			disabled={device.isRestricted || !device.id}
		>
			<div class="text-gray-600 dark:text-gray-400">
				{#if device.type === 'smartphone'}
					<PhoneIcon class="h-8 w-8" />
				{:else if device.type === 'computer'}
					<ComputerIcon class="h-8 w-8" />
				{:else}
					<SpeakerIcon class="h-8 w-8" />
				{/if}
			</div>

			<div class="flex flex-col items-start">
				<div
					class="text-sm font-medium text-gray-900 dark:text-gray-100 {device.isActive
						? 'text-green-800 dark:text-green-200'
						: ''}"
				>
					{device.name}
					{#if device.isActive}
						<span class="ml-1 text-xs text-green-600 dark:text-green-400">• Active</span>
					{/if}
				</div>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					{getDeviceTypeLabel(device.type)}
				</div>
			</div>
		</Button>
	{/each}
</div>
