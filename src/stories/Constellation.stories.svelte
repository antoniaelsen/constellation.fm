<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from '@storybook/test';
	import Constellation from '../lib/client/components/constellations/Constellation.svelte';
	import SceneDecorator from './decorators/SceneDecorator.svelte';
	import { CONSTELLATIONS } from './mocks/constellations';

	const { Story } = defineMeta({
		title: 'constellations/Constellation',
		component: Constellation,
		decorators: [() => SceneDecorator as any],
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		args: {}
	});

	const CONSTELLATION = CONSTELLATIONS[0];
</script>

<Story
	name="Basic"
	args={{
		activeNodeId: null,
		showNameplates: false,
		constellation: CONSTELLATION,
		selectedNodeIds: [],
		onStarClick: fn(),
		onStarButtonClick: fn(),
		onEdgeRemove: fn()
	}}
>
	{#snippet template(args)}
		<Constellation
			activeNodeId={args.activeNodeId}
			constellation={args.constellation}
			showNameplates={args.showNameplates}
			selectedNodeIds={args.selectedNodeIds}
			onStarClick={(star, e) => {
				if (!e.nativeEvent.shiftKey) {
					return;
				}
				if (args.selectedNodeIds.includes(star.id)) {
					args.selectedNodeIds = args.selectedNodeIds.filter((id) => id !== star.id);
				} else {
					args.selectedNodeIds.push(star.id);
				}
				args.onStarClick?.(star, e);
			}}
		/>
	{/snippet}
</Story>
