<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import NamePlate from '$lib/client/components/constellations/Nameplate.svelte';

	const { Story } = defineMeta({
		title: 'constellations/NamePlate',
		component: NamePlate,
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
		name: 'Mock Track',
		href: '',
		artists: [
			{ name: 'Mock Artist 1', href: '' },
			{ name: 'Mock Artist 2', href: '' }
		]
	}}
/>
