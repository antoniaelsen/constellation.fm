<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Star from '$lib/client/components/constellations/Star.svelte';
	import { fn } from '@storybook/test';
	import { mockTrack } from './mocks/constellations';

	import SceneDecorator from './decorators/SceneDecorator.svelte';

	const { Story } = defineMeta({
		title: 'constellations/Star',
		component: Star,
		decorators: [() => SceneDecorator as any],
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		args: {
			onClick: fn(),
			onNameplateButtonClick: fn()
		}
	});
</script>

<Story
	name="Basic"
	args={{
		activeColor: 'cyan',
		color: 'white',
		scale: 1,
		showNameplate: true,
		index: 0,
		isActive: false,
		isSelected: false,
		metadata: mockTrack(),
		onClick: fn(),
		onNameplateButtonClick: fn()
	}}
>
	{#snippet template(args)}
		<Star
			activeColor={args.activeColor}
			color={args.color}
			scale={args.scale}
			showNameplate={args.showNameplate}
			index={args.index}
			isActive={args.isActive}
			isSelected={args.isSelected}
			metadata={args.metadata}
			onClick={(e: IntersectionEvent) => {
				args.onClick?.(e);
				if (!e.nativeEvent.altKey) {
					return;
				}

				args.isSelected = !args.isSelected;
			}}
		/>
	{/snippet}
</Story>
