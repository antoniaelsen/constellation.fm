<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { untrack } from 'svelte';

	import { page } from '$app/stores';
	import { starKey, useConstellation } from '$lib/client/api/constellations';
	import { usePlaybackStart } from '$lib/client/api/spotify';
	import Constellation from '$lib/client/components/constellations/Constellation.svelte';
	import { playerState } from '$lib/client/stores/player';
	import type { Star, Edge } from '$lib/types/constellations';
	import { cameraStore } from '$lib/client/stores/camera';

	const req = $derived(
		useConstellation($page.params.constellationId, { retry: false, refetchOnWindowFocus: false })
	);

	const mPlay = usePlaybackStart();

	const setControlsTarget = (position: THREE.Vector3) => {
		const target = new THREE.Vector3(position.x, position.y, position.z);

		untrack(() => ($cameraStore.targetPosition = target));
	};

	const getActiveNodeId = (stars: Star[], playerState: typeof $playerState) => {
		const { current, next, previous } = playerState.window;
		if (!current) {
			return null;
		}

		const indices =
			$req.data?.stars
				.sort((a: Star, b: Star) => a.providerOrder - b.providerOrder)
				.map((star, i) => ({
					star,
					i
				}))
				.filter(({ star }) => star.providerTrackId === current.providerTrackId) ?? [];

		if (indices.length === 0) {
			return null;
		}

		if (indices.length === 1) {
			return indices[0].star.id;
		}

		while (indices.length > 1) {
			const i = indices[0].i;
			if (next) {
				if (i + 1 >= stars.length) {
					indices.shift();
					continue;
				}
				if (stars[i + 1].providerTrackId !== next.providerTrackId) {
					indices.shift();
					continue;
				}
			}
			if (previous) {
				if (i - 1 < 0) {
					indices.pop();
					continue;
				}
				if (stars[i - 1].providerTrackId !== previous.providerTrackId) {
					indices.pop();
					continue;
				}
			}

			return stars[i].id;
		}

		return null;
	};

	let activeNodeId = $derived(getActiveNodeId($req.data?.stars ?? [], $playerState));
	let selectedNodeIds = $state<string[]>([]);

	const onStarButtonClick = async (star: Star) => {
		const { currentDevice } = $playerState;
		if (!currentDevice?.id) {
			return;
		}

		const uri = $req.data?.metadata?.uri;
		if (!uri) {
			return;
		}

		const position = star.providerOrder;

		await $mPlay.mutateAsync({
			deviceId: currentDevice.id,
			positionMs: 0,
			contextUri: uri,
			offset: { position }
		});
	};

	const onStarClick = (star: Star, event: IntersectionEvent) => {
		const e = event.nativeEvent;
		if (!e.shiftKey) {
			return;
		}

		const starId = star.id;
		const currentIndex = selectedNodeIds.indexOf(starId);

		if (currentIndex >= 0) {
			// Deselect if already selected
			selectedNodeIds = selectedNodeIds.filter((id) => id !== starId);
		} else {
			// Add to selection, limit to 2
			if (selectedNodeIds.length >= 2) {
				selectedNodeIds = [selectedNodeIds[1], starId];
			} else {
				selectedNodeIds = [...selectedNodeIds, starId];
			}
		}
	};

	const onEdgeRemove = (edge: Edge) => {
		console.log('Removing edge:', edge);
		// TODO: Implement edge removal API call
	};

	const { scene } = useThrelte();

	$effect(() => {
		const activeStar = $req.data?.stars.find((star) => star.id === activeNodeId);
		if (activeStar) {
			const key = starKey(activeStar);
			const obj = untrack(() => scene.getObjectByName(key));
			if (obj) {
				untrack(() => setControlsTarget(obj.position.clone()));
			}
		}
	});
</script>

{#if $req.data}
	<Constellation
		activeNodeId={`${activeNodeId}`}
		constellation={$req.data}
		{selectedNodeIds}
		showNameplates={true}
		{onStarButtonClick}
		{onStarClick}
		{onEdgeRemove}
	/>
{/if}
