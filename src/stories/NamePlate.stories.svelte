<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Nameplate from '$lib/client/components/Nameplate.svelte';

	const { Story } = defineMeta({
		title: 'Nameplate',
		component: Nameplate,
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
		],
		album: {
			name: 'Mock Album',
			images: [{ url: 'https://placecats.com/200/200' }]
		}
	}}
/>
