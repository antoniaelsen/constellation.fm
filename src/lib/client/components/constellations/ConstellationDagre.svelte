<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force-3d';
	import { Spring } from 'svelte/motion';
	import * as THREE from 'three';

	import type { Constellation, Edge as IEdge, Star as IStar } from '$lib/types/constellations';
	import Star from './Star.svelte';
	import type { Star as StarType, Edge } from '$lib/types/constellations';

	const SCALE_STAR = 5;
	const SCALE_LINK = 0.5;
	const WIDTH_LINK_HOVER = 15;
	const EDGE_OPACITY_MIN = 0.15;

	interface D3ForceNode {
		index: number;
		x: number;
		y: number;
		z: number;
	}

	interface StarD3ForceNode extends D3ForceNode {
		star: StarType;
	}

	interface D3ForceLink {
		index: number;
		source: { index: number };
		target: { index: number };
	}

	interface Props {
		constellation: Constellation;
		activeNodeId: string | null;
		selectedNodeIds?: string[];
		showNameplates?: boolean;
		linkWidth?: number;
		chargeStrength?: number;
		centerStrength?: number;
		alphaMin?: number;
		alphaDecay?: number;
		alphaTarget?: number;
		velocityDecay?: number;
		onStarButtonClick?: (star: StarType) => void;
		onStarClick?: (star: StarType, event: IntersectionEvent) => void;
		onEdgeRemove?: (edge: Edge) => void;
	}

	const {
		constellation,

		activeNodeId,
		selectedNodeIds = [],
		showNameplates,
		onStarButtonClick,
		onStarClick,
		onEdgeRemove,

		linkWidth = 1,

		chargeStrength = -200,
		centerStrength = 1,

		alphaMin = 0,
		alphaDecay = 0.0228,
		alphaTarget = 0,
		velocityDecay = 0.4
	}: Props = $props();

	let stars = $state<StarD3ForceNode[]>([]);
	let links = $state<D3ForceLink[]>([]);
	let hoveredEdgeIndex = $state<number | null>(null);
	let hoverTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	const sim = $derived.by(() => {
		const nodes = constellation.stars.map((s: IStar, index: number) => ({
			star: s,
			id: s.id,
			index
		}));

		const edges = constellation.edges.map((e: IEdge) => {
			const source = nodes.find((n) => n.star.id === e.sourceId);
			const target = nodes.find((n) => n.star.id === e.targetId);
			return { source, target };
		});

		const link = forceLink(edges);

		const sim = forceSimulation(nodes, 3)
			.alphaMin(alphaMin)
			.alphaDecay(alphaDecay)
			.alphaTarget(alphaTarget)
			.velocityDecay(velocityDecay)
			.force('link', link)
			.force('charge', forceManyBody().strength(chargeStrength))
			.force('center', forceCenter().strength(centerStrength))
			.stop();

		return { simulation: sim, link };
	});

	const activeStarIndex = $derived.by(() => {
		return stars.findIndex((star) => star.star.id === activeNodeId);
	});

	const linkGeometry = $derived.by(() => {
		return links.map((link) => {
			const sourcePos = [
				stars[link.source.index].x || 0,
				stars[link.source.index].y || 0,
				stars[link.source.index].z || 0
			];
			const targetPos = [
				stars[link.target.index].x || 0,
				stars[link.target.index].y || 0,
				stars[link.target.index].z || 0
			];
			const direction = new THREE.Vector3(...targetPos).sub(new THREE.Vector3(...sourcePos));
			const length = direction.length();
			const center = new THREE.Vector3(...sourcePos).add(direction.multiplyScalar(0.5));
			const quaternion = new THREE.Quaternion();
			const up = new THREE.Vector3(0, 1, 0);
			quaternion.setFromUnitVectors(up, direction.normalize());

			return {
				center: [center.x, center.y, center.z] as [number, number, number],
				quaternion: quaternion.toArray(),
				length
			};
		});
	});

	const calculateEdgeOpacity = (i: number, activeIndex: number, totalLength: number): number => {
		if (activeIndex < 0) {
			return EDGE_OPACITY_MIN;
		}

		let distanceToActive = i >= activeIndex ? totalLength - i + activeIndex : activeIndex - i;

		const normalizedDistance = distanceToActive / totalLength;

		return Math.max(Math.exp(-5 * normalizedDistance), EDGE_OPACITY_MIN);
	};

	const onPointerEnter = (e: PointerEvent, i: number) => {
		if (hoverTimeout) clearTimeout(hoverTimeout);
		hoveredEdgeIndex = i;
	};

	const onPointerLeave = (e) => {
		hoveredEdgeIndex = null;
	};

	useTask(() => {
		sim.simulation.tick();
		stars = sim.simulation.nodes();
		links = sim.link.links();
	});
</script>

{#each stars as star (star.index)}
	<Star
		active={star.index === activeStarIndex}
		isSelected={selectedNodeIds.includes(star.star.id)}
		index={star.star.providerOrder}
		position={[star.x || 0, star.y || 0, star.z || 0]}
		scale={SCALE_STAR}
		metadata={star.star.metadata}
		showNameplate={showNameplates}
		onClick={(event) => {
			onStarClick?.(star.star, event);
		}}
		onNameplateButtonClick={() => {
			onStarButtonClick?.(star.star);
		}}
	/>
{/each}
{#each links as link, i}
	{#if linkWidth > 0}
		<T.Group
			position={linkGeometry[i].center}
			quaternion={linkGeometry[i].quaternion}
			onpointerenter={(e) => {
				onPointerEnter(e.nativeEvent, i);
			}}
			onpointerleave={(e) => {
				onPointerLeave(e.nativeEvent);
			}}
		>
			<!-- Main link mesh -->
			<T.Mesh>
				<T.CylinderGeometry
					args={[linkWidth * SCALE_LINK, linkWidth * SCALE_LINK, linkGeometry[i].length, 8]}
				/>
				<T.MeshBasicMaterial
					color="white"
					transparent
					transition={{
						opacity: {
							duration: 500,
							easing: 'easeInOut'
						}
					}}
					opacity={calculateEdgeOpacity(i, activeStarIndex, links.length) *
						(hoveredEdgeIndex === i ? 3.0 : 1)}
				/>
			</T.Mesh>

			<!-- Invisible hover mesh -->
			<T.Mesh>
				<T.CylinderGeometry
					args={[
						WIDTH_LINK_HOVER * SCALE_LINK,
						WIDTH_LINK_HOVER * SCALE_LINK,
						linkGeometry[i].length,
						8
					]}
				/>
				<T.MeshBasicMaterial color="cyan" transparent opacity={0} />
			</T.Mesh>
		</T.Group>
	{/if}
{/each}
