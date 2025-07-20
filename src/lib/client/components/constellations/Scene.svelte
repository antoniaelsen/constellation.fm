<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, interactivity } from '@threlte/extras';

	interactivity();

	let { children } = $props();
</script>

<T.PerspectiveCamera
	makeDefault
	position={[250, 250, 250]}
	near={0.01}
	far={10000}
	oncreate={(ref) => {
		ref.lookAt(0, 1, 0);
	}}
>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} />

{@render children()}
