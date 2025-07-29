<script lang="ts">
	import { T } from '@threlte/core';
	import { onMount, onDestroy } from 'svelte';
	import type { GraphData, ForceEngine, DagMode } from './types';
	import ThreeForceGraph from 'three-forcegraph';
	import { fromThree } from './fromThree';
	import type { ComponentType } from 'svelte';

	interface Props {
		cooldownTicks?: number;
		cooldownTime?: number;
		d3AlphaDecay?: number;
		d3AlphaMin?: number;
		d3AlphaTarget?: number;
		d3VelocityDecay?: number;
		dagMode?: DagMode;
		forceEngine?: ForceEngine;
		graphData?: GraphData;
		graphRef?: any;
		linkAutoColorBy?: string | null;
		linkColor?: string;
		linkCurvature?: number;
		linkCurveRotation?: number;
		linkDirectionalArrowColor?: string;
		linkDirectionalArrowLength?: number;
		linkDirectionalArrowRelPos?: number;
		linkDirectionalArrowResolution?: number;
		linkDirectionalParticleColor?: string;
		linkDirectionalParticleResolution?: number;
		linkDirectionalParticleSpeed?: number;
		linkDirectionalParticles?: number;
		linkDirectionalParticleWidth?: number;
		linkOpacity?: number;
		linkResolution?: number;
		linkSource?: string;
		linkTarget?: string;
		linkThreeObject?: THREE.Object3D;
		linkThreeObjectExtend?: boolean | string | ((link: any) => boolean);
		linkVisibility?: boolean | string | ((link: any) => boolean);
		linkWidth?: number;
		nodeAutoColorBy?: string | null;
		nodeColor?: string;
		nodeId?: string;
		nodeOpacity?: number;
		nodeRelSize?: number;
		nodeResolution?: number;
		nodeThreeObject?: THREE.Object3D | ComponentType;
		nodeThreeObjectExtend?: boolean | string | ((node: any) => boolean);
		nodeVal?: number;
		nodeVisibility?: boolean | string | ((node: any) => boolean);
		numDimensions?: 1 | 2 | 3;
		warmupTicks?: number;
		onEngineTick?: () => void;
		onEngineStop?: () => void;
		onFinishLoading?: () => void;
		onFinishUpdate?: () => void;
		onLoading?: () => void;
		onUpdate?: () => void;
	}

	let {
		graphRef = $bindable(),
		graphData = { nodes: [], links: [] },
		nodeId = 'id',
		linkSource = 'source',
		linkTarget = 'target',
		nodeRelSize = 4,
		nodeVal,
		nodeColor,
		nodeAutoColorBy = null,
		nodeOpacity = 1,
		linkColor,
		linkAutoColorBy = null,
		linkWidth = 1,
		linkOpacity = 0.75,
		linkCurvature = 0,
		forceEngine = 'd3',
		numDimensions = 3,
		dagMode,
		nodeResolution = 8,
		nodeVisibility = true,
		nodeThreeObject,
		nodeThreeObjectExtend = false,
		linkVisibility = true,
		linkResolution = 6,
		linkCurveRotation = 0,
		linkThreeObjectExtend = false,
		linkDirectionalArrowLength = 0,
		linkDirectionalArrowColor,
		linkDirectionalArrowRelPos = 0.5,
		linkDirectionalArrowResolution = 8,
		linkDirectionalParticles = 0,
		linkDirectionalParticleSpeed = 0.01,
		linkDirectionalParticleWidth = 0.5,
		linkDirectionalParticleColor,
		linkDirectionalParticleResolution = 4,
		d3AlphaMin = 0,
		d3AlphaDecay = 0.0228,
		d3AlphaTarget = 0,
		d3VelocityDecay = 0.4,
		warmupTicks = 0,
		cooldownTicks = Infinity,
		cooldownTime = 15000,
		onEngineTick,
		onEngineStop,
		onLoading,
		onFinishLoading,
		onUpdate,
		onFinishUpdate
	}: Props = $props();

	// Make graph bindable

	const METHOD_NAMES = [
		'emitParticle',
		'getGraphBbox',
		'd3ReheatSimulation',
		'd3Force',
		'resetCountdown',
		'tickFrame',
		'refresh'
	];

	const { threeObj: graph, createNodeObject } = fromThree(ThreeForceGraph, {
		methodNames: METHOD_NAMES
	});

	graphRef = graph;

	onMount(() => {
		console.log(' - on mount');
		console.log('   - graph: ', graph);

		graph
			.graphData(graphData)
			.nodeId(nodeId)
			.linkSource(linkSource)
			.linkTarget(linkTarget)
			.nodeRelSize(nodeRelSize)
			.nodeVal(nodeVal)
			.nodeColor(nodeColor)
			.nodeAutoColorBy(nodeAutoColorBy)
			.nodeOpacity(nodeOpacity)
			.linkColor(linkColor)
			.linkAutoColorBy(linkAutoColorBy)
			.linkWidth(linkWidth)
			.linkOpacity(linkOpacity)
			.linkCurvature(linkCurvature)
			.forceEngine(forceEngine)
			.numDimensions(numDimensions)
			.nodeResolution(nodeResolution)
			.nodeVisibility(nodeVisibility)
			.nodeThreeObjectExtend(nodeThreeObjectExtend)
			.linkVisibility(linkVisibility)
			.linkResolution(linkResolution)
			.linkCurveRotation(linkCurveRotation)
			.linkThreeObjectExtend(linkThreeObjectExtend)
			.linkDirectionalArrowLength(linkDirectionalArrowLength)
			.linkDirectionalArrowColor(linkDirectionalArrowColor)
			.linkDirectionalArrowRelPos(linkDirectionalArrowRelPos)
			.linkDirectionalArrowResolution(linkDirectionalArrowResolution)
			.linkDirectionalParticles(linkDirectionalParticles)
			.linkDirectionalParticleSpeed(linkDirectionalParticleSpeed)
			.linkDirectionalParticleWidth(linkDirectionalParticleWidth)
			.linkDirectionalParticleColor(linkDirectionalParticleColor)
			.linkDirectionalParticleResolution(linkDirectionalParticleResolution)
			.d3AlphaMin(d3AlphaMin)
			.d3AlphaDecay(d3AlphaDecay)
			.d3AlphaTarget(d3AlphaTarget)
			.d3VelocityDecay(d3VelocityDecay)
			.warmupTicks(warmupTicks)
			.cooldownTicks(cooldownTicks)
			.cooldownTime(cooldownTime)
			.onEngineTick(onEngineTick)
			.onEngineStop(onEngineStop)
			.onLoading(onLoading)
			.onFinishLoading(onFinishLoading)
			.onUpdate(onUpdate)
			.onFinishUpdate(onFinishUpdate);

		if (dagMode) {
			graph.dagMode(dagMode);
		}

		// console.log('nodeThreeObject: ', nodeThreeObject);
		// if (nodeThreeObject) {
		// 	if (typeof nodeThreeObject === 'function') {
		// 		console.log(' - nodeThreeObject is a function');
		// 		graph.nodeThreeObject((node) => {
		// 			const obj = createNodeObject(nodeThreeObject, node);
		// 			console.log('called nodeThreeObject with node', node, 'got obj', obj);
		// 			return obj;
		// 		});
		// 	} else {
		// 		console.log(' - nodeThreeObject is not a function');
		// 		graph.nodeThreeObject(nodeThreeObject);
		// 	}
		// }
	});

	onDestroy(() => {
		console.log(' - on destroy: ', graph);
		if (graph) {
			// TODO(antoniae)
			// graph.dispose();
		}
	});

	$effect(() => {
		if (graph && graphData) {
			graph.graphData(graphData);
		}
	});

	$effect(() => {
		if (!graphRef) return;

		// Get simulation object
		const simulation = graphRef.d3Force();

		// Inspect current state
		const state = {
			// Force configurations
			forces: {
				link: graphRef.d3Force('link')?.strength(),
				charge: graphRef.d3Force('charge')?.strength(),
				center: graphRef.d3Force('center')?.strength(),
				radial: graphRef.d3Force('radial')?.strength(),
				manyBody: graphRef.d3Force('charge')?.distanceMax()
			},
			// Simulation parameters
			simulation: {
				alpha: simulation?.alpha(),
				alphaTarget: simulation?.alphaTarget(),
				alphaDecay: simulation?.alphaDecay(),
				velocityDecay: simulation?.velocityDecay()
			},
			// Layout parameters
			layout: {
				numDimensions: graphRef.numDimensions(),
				dagMode: graphRef.dagMode(),
				dagLevelDistance: graphRef.dagLevelDistance()
			}
		};

		console.log('Force Graph State:', state);
	});
</script>

<T is={graph}></T>
