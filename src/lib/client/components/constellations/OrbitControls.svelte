<script lang="ts">
	import { OrbitControls } from '@threlte/extras';
	import type { ComponentProps } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js';

	import { cameraStore } from '$lib/client/stores/camera';

	interface OrbitControlsProps extends ComponentProps<typeof OrbitControls> {
		duration?: number;
	}
	let { duration = 2000, ...rest }: OrbitControlsProps = $props();

	let controls: any = $state<OrbitControlsType | null>(null);
	const targetTween = new Tween({ x: 0, y: 0, z: 0 }, { duration, easing: cubicOut });

	$effect(() => {
		if (!controls) return;
		$cameraStore.controls = controls;

		const currentTarget = controls.target.clone();
		targetTween.target = {
			x: currentTarget.x,
			y: currentTarget.y,
			z: currentTarget.z
		};
	});

	$effect(() => {
		if (!$cameraStore.controls || !$cameraStore.targetPosition || !$cameraStore.isTracking) return;

		const newTarget = $cameraStore.targetPosition;

		targetTween.target = {
			x: newTarget.x,
			y: newTarget.y,
			z: newTarget.z
		};
	});

	$effect(() => {
		if (!$cameraStore.controls) return;

		const current = targetTween.current;
		$cameraStore.controls.target.set(current.x, current.y, current.z);
		$cameraStore.controls.update();
	});
</script>

<OrbitControls {...rest} bind:ref={controls} />
