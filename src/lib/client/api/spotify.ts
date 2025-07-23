import type { PlaybackState, SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { useQuery, useQueryClient, type QueryOptions } from '@sveltestack/svelte-query';
import { apiFetch } from './fetch';

export const getPlaybackState = async () => {
	return apiFetch(`/api/spotify/me/player`).then(async (res) => {
		if (!res.ok) {
			throw new Error(`Failed to get playback state: ${res.statusText}`);
		}
		return res.json();
	});
};

export const getPlaylists = async (
	{ limit, offset }: { limit: number; offset: number } = { limit: 50, offset: 0 }
) => {
	return apiFetch(`api/spotify/me/playlists?limit=${limit}&offset=${offset}`)
		.then((res) => res.json())
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to get playlists: ${res.statusText}`);
			}
			return res.json();
		});
};

export const startPlayback = async (
	deviceId: string,
	contextUri: string,
	offset: { position: number },
	positionMs: number
) => {
	return apiFetch(`/api/spotify/me/player/play`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ deviceId, contextUri, offset, positionMs })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to start playback: ${res.statusText}`);
		}
	});
};

export const setRepeatMode = async (
	state: 'track' | 'context' | 'off',
	deviceId: string | null = null
) => {
	return apiFetch(`/api/spotify/me/player/repeat`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ state, deviceId })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to set repeat mode: ${res.statusText}`);
		}
	});
};

export const setShuffle = async (state: boolean, deviceId: string | null = null) => {
	return apiFetch(`/api/spotify/me/player/shuffle`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ state, deviceId })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to set shuffle: ${res.statusText}`);
		}
	});
};

export const usePlaybackState = (opts: QueryOptions<PlaybackState>) => {
	return useQuery(['me/player'], () => getPlaybackState(), opts);
};

export const usePlaylists = (params: { limit: number; offset: number }) => {
	return useQuery(['me/playlists', params], () => getPlaylists(params));
};

export const useAllPlaylists = () => {
	const queryClient = useQueryClient();

	return useQuery(
		['me/playlists'],
		async () => {
			let allPlaylists: SimplifiedPlaylist[] = [];
			let hasMore = true;
			let offset = 0;
			const limit = 50;

			while (hasMore) {
				const response = await getPlaylists({ limit, offset });
				allPlaylists = [...allPlaylists, ...response.items];

				queryClient.setQueryData(['me/playlists'], allPlaylists);

				if (response.next) {
					offset += limit;
				} else {
					hasMore = false;
				}
			}

			return allPlaylists;
		},
		{
			keepPreviousData: true
		}
	);
};
