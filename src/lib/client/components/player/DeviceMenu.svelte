<script lang="ts">
	import { Dropdown } from 'flowbite-svelte';
	import SpeakersIcon from 'virtual:icons/ic/baseline-speaker';
	import type { Device } from '$lib/types/music';
	import DeviceList from './DeviceList.svelte';
	import GhostButton from '../GhostButton.svelte';

	interface Props {
		devices: Device[];
		onDeviceSelect?: (device: Device) => void;
	}

	let { devices, onDeviceSelect }: Props = $props();
</script>

<GhostButton pill={true} color="dark">
	<SpeakersIcon class="h-5 w-5" />
</GhostButton>
<Dropdown placement="top" class="w-64 p-2">
	<DeviceList {devices} {onDeviceSelect} />
</Dropdown>
