<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { HTML, Outlines } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import * as THREE from 'three';

	import type { ETrackMetadata } from '$lib/types/music';
	import Nameplate from '../Nameplate.svelte';

	interface Props {
		activeColor?: string;
		color?: string;
		key: string;
		index: number;
		isActive?: boolean;
		isSelected?: boolean;
		metadata?: ETrackMetadata;
		scale?: number;
		showNameplate?: boolean;
		position?: [number, number, number];

		onClick?: (event: IntersectionEvent) => void;
		onNameplateButtonClick?: () => void;
	}

	let groupRef = $state<THREE.Group | undefined>();
	let starRef = $state<THREE.Mesh | undefined>();

	let {
		activeColor = 'cyan',
		color = 'white',
		key,
		position,
		scale = 1,
		showNameplate = $bindable(true),
		isActive = $bindable(false),
		isSelected = false,
		index,
		metadata,
		onClick,
		onNameplateButtonClick,
		...rest
	}: Props = $props();

	let scaleHover = new Spring(1, { stiffness: 0.15, damping: 1 });
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

		const p = direction.multiplyScalar(100);
		p.add(right.multiplyScalar(10));
		platePosition = p.toArray();

		plateQuaternion = camera.current.quaternion.toArray();
	});

	$effect(() => {
		const factive = isActive ? 1.75 : 1;
		const fhover = hovered ? 1.5 : 1;

		scaleHover.target = factive * fhover;
	});
</script>

<T.Group name={key} {position} {...rest} bind:ref={groupRef}>
	<T.Mesh
		bind:ref={starRef}
		scale={scaleHover.current * scale}
		onpointerenter={() => {
			hovered = true;
		}}
		onpointerleave={() => {
			hovered = false;
		}}
		onclick={(e: IntersectionEvent) => {
			onClick?.(e);
			e.stopPropagation(); // Needed to prevent double
		}}
	>
		<T.SphereGeometry args={[1]} />
		<T.MeshBasicMaterial color={isActive ? activeColor : color} side={THREE.DoubleSide} />

		{#if isSelected}
			<Outlines color="green" thickness={0.33} />
		{/if}
	</T.Mesh>

	{#if showNameplate && metadata}
		<T.Group position={platePosition} quaternion={plateQuaternion} scale={10}>
			<HTML transform={true}>
				<div
					onpointerenter={() => {
						hovered = true;
					}}
					onpointerleave={() => {
						hovered = false;
					}}
				>
					<Nameplate
						className={`${hovered || isActive ? 'opacity-100' : 'opacity-75 bg-transparent! border-none! shadow-none!'} absolute -translate-y-1/2 -translate-x-2 transition-all duration-500 pointer-events-auto`}
						name={metadata.name ?? ''}
						href={metadata.href ?? ''}
						artists={metadata.artists}
						album={metadata.album}
						isLocal={metadata.isLocal}
						{index}
						onButtonClick={() => {
							onNameplateButtonClick?.();
						}}
					/>
				</div>
			</HTML>
		</T.Group>
	{/if}
</T.Group>
