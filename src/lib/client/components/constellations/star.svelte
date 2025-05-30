<script lang="ts">
	import { T } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { Spring } from 'svelte/motion';

	let { color = 'white', ...rest } = $props();

	interactivity();

	const scale = new Spring(1);
</script>

<T.Mesh
	{...rest}
	scale={scale.current}
	onpointerenter={() => {
		scale.target = 1.5;
	}}
	onpointerleave={() => {
		scale.target = 1;
	}}
>
	<T.SphereGeometry args={[1]} />
	<T.MeshBasicMaterial {color} />
</T.Mesh>
