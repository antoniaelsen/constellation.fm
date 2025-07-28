<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';
	import DeviceMenu from '$lib/client/components/player/DeviceMenu.svelte';
	import { MOCK_DEVICES } from './mocks/devices';

	const { Story } = defineMeta({
		title: 'player/DeviceMenu',
		component: DeviceMenu,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		args: {}
	});
</script>

<Story
	name="Basic"
	args={{
		devices: MOCK_DEVICES,
		onDeviceSelect: fn()
	}}
/>
