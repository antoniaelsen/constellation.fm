<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Star from '$lib/client/components/constellations/Star.svelte';
	import { fn } from '@storybook/test';
	import { mockTrack } from './mocks/constellations';

	import SceneDecorator from './decorators/SceneDecorator.svelte';

	const { Story } = defineMeta({
		title: 'constellations/Star',
		component: Star,
		decorators: [() => SceneDecorator],
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		args: {
			onClick: fn()
		}
	});
</script>

<Story
	name="Basic"
	args={{
		metadata: mockTrack()
	}}
/>
