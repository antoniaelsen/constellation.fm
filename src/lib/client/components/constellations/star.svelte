<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { HTML, interactivity } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import * as THREE from 'three';
	import Nameplate from '../Nameplate.svelte';
	import type { ETrackMetadata } from '$lib/types/constellations';

	interactivity();

	interface Props {
		active?: boolean;
		activeColor?: string;
		color?: string;
		scale?: number;
		showNameplate?: boolean;
		metadata: ETrackMetadata;
		onClick: () => void;
	}

	let groupRef = $state<THREE.Group | undefined>();
	let starRef = $state<THREE.Mesh | undefined>();

	let {
		active = $bindable(false),
		activeColor = 'cyan',
		color = 'white',
		scale = 1,
		showNameplate = $bindable(true),
		metadata,
		onClick,
		...rest
	}: Props = $props();

	let scaleHover = new Spring(1);
	let hovered = $state(false);
	let platePosition = $state<[number, number, number]>([0, 0, 0]);
	let plateQuaternion = $state<[number, number, number, number]>([0, 0, 0, 1]);

	const { camera } = useThrelte();

	useTask(() => {
		if (!groupRef) return;
		const direction = new THREE.Vector3();
		direction.subVectors(camera.current.position, groupRef.position).normalize();

		// Get the camera's right vector for consistent offset
		const right = camera.current.getWorldDirection(new THREE.Vector3());
		right.cross(camera.current.up).normalize();

		const position = direction.multiplyScalar(100);
		position.add(right.multiplyScalar(30));
		platePosition = position.toArray();

		// Simply copy the camera's quaternion to make the plate parallel to view plane
		plateQuaternion = camera.current.quaternion.toArray();
	});

	$effect(() => {
		const factive = active ? 1.75 : 1;
		const fhover = hovered ? 1.5 : 1;

		scaleHover.target = factive * fhover;
	});
</script>

<T.Group bind:ref={groupRef} {...rest}>
	<T.Mesh
		bind:ref={starRef}
		scale={scaleHover.current * scale}
		onpointerenter={() => {
			hovered = true;
		}}
		onpointerleave={() => {
			hovered = false;
		}}
		onclick={onClick}
	>
		<T.SphereGeometry args={[1]} />
		<T.MeshBasicMaterial color={active ? activeColor : color} side={THREE.DoubleSide} />
	</T.Mesh>

	{#if showNameplate}
		<T.Group position={platePosition} quaternion={plateQuaternion} scale={10}>
			<HTML transform={true} occlude={'blending'}>
				<Nameplate
					className={hovered || active ? 'opacity-100' : 'opacity-50'}
					name={metadata.name ?? ''}
					href={metadata.href ?? ''}
					artists={metadata.artists}
					album={metadata.album}
					onpointerenter={() => {
						hovered = true;
					}}
					onpointerleave={() => {
						hovered = false;
					}}
				/>
			</HTML>
		</T.Group>
	{/if}
</T.Group>
