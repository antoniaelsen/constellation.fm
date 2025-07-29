import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { useQuery, useQueryClient } from '@sveltestack/svelte-query';
import { apiFetch } from './fetch';

export const getPlaylists = async (
	{ limit, offset }: { limit: number; offset: number } = { limit: 50, offset: 0 }
) => {
	return apiFetch(`api/spotify/me/playlists?limit=${limit}&offset=${offset}`).then((res) =>
		res.json()
	);
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
	});
};

export const useSpotifyPlaylists = (params: { limit: number; offset: number }) => {
	return useQuery(['me/playlists', params], () => getPlaylists(params));
};

export const useAllSpotifyPlaylists = () => {
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
