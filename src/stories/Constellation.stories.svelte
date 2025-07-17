<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Constellation from '../lib/client/components/constellations/Constellation.svelte';
	import SceneDecorator from './decorators/SceneDecorator.svelte';
	import { CONSTELLATIONS } from './mocks/constellations';

	const { Story } = defineMeta({
		title: 'constellations/Constellation',
		component: Constellation,
		decorators: [() => SceneDecorator],
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen'
		},
		args: {}
	});

	const CONSTELLATION = CONSTELLATIONS[0];
</script>

<Story name="Basic" args={{ activeNodeId: '1', constellation: CONSTELLATION }} />
