<script lang="ts">
	import type { Intersection } from 'three';
	import { useConstellation } from '$lib/client/api/constellations';
	import { page } from '$app/stores';
	import { startPlayback } from '$lib/client/api/spotify';
	import Constellation from '$lib/client/components/constellations/Constellation.svelte';
	import { playerState } from '$lib/client/stores/player';
	import type { Star, Edge } from '$lib/types/constellations';

	const req = $derived(
		useConstellation($page.params.constellationId, { retry: false, refetchOnWindowFocus: false })
	);

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
			const index = stars[i].id;
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
		const { deviceId } = $playerState;
		if (!deviceId) {
			return;
		}

		const uri = $req.data?.metadata?.uri;
		if (!uri) {
			return;
		}

		const position = star.providerOrder;

		await startPlayback(deviceId, uri, { position }, 0);
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
