import type {
	Device as SpotifyDevice,
	PlaybackState,
	SimplifiedPlaylist
} from '@spotify/web-api-ts-sdk';
import {
	useMutation,
	useQuery,
	useQueryClient,
	type QueryObserverOptions,
	type UseMutationOptions
} from '@sveltestack/svelte-query';
import { apiFetch } from './fetch';
import { type Device, DeviceType } from '$lib/types/music';

export const getAvailableDevices = async () => {
	return apiFetch(`/api/spotify/me/player/devices`).then(async (res) => {
		if (!res.ok) {
			throw new Error(`Failed to get available devices: ${res.statusText}`);
		}
		return res.json();
	});
};

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

export const playbackPause = async (deviceId: string) => {
	return apiFetch(`/api/spotify/me/player/pause`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ deviceId })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to pause playback: ${res.statusText}`);
		}
	});
};

export const playbackStart = async (
	deviceId: string,
	positionMs: number,
	contextUri: string,
	offset?: { position: number } | null
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

export const playbackSeekToPosition = async (deviceId: string, positionMs: number) => {
	return apiFetch(`/api/spotify/me/player/seek`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ deviceId, positionMs })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to seek to position: ${res.statusText}`);
		}
	});
};

export const playbackSkipNext = async (deviceId: string) => {
	return apiFetch(`/api/spotify/me/player/next`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ deviceId })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to skip next: ${res.statusText}`);
		}
	});
};

export const playbackSkipPrevious = async (deviceId: string) => {
	return apiFetch(`/api/spotify/me/player/previous`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ deviceId })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to skip next: ${res.statusText}`);
		}
	});
};

export const playbackSetVolume = async (volume: number, deviceId: string) => {
	return apiFetch(`/api/spotify/me/player/volume`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ volume, deviceId })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to set volume: ${res.statusText}`);
		}
	});
};

export const playbackTransfer = async (deviceId: string) => {
	return apiFetch(`/api/spotify/me/player`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ deviceId: deviceId })
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to transfer playback: ${res.statusText}`);
		}
	});
};

const toDevice = (device: SpotifyDevice & { supports_volume: boolean }): Device => {
	const { id, name, type, is_active, is_restricted, supports_volume, volume_percent } = device;

	return {
		id,
		name,
		type: type.toLowerCase() as DeviceType,
		isActive: is_active,
		isRestricted: is_restricted,
		isVolumeSupported: supports_volume,
		volume: volume_percent ?? 0
	};
};

export const useInvalidatePlayerDevices = () => {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries(['me/player/devices']);
};

export const useAvailableDevices = (opts: QueryObserverOptions<Device[]>) => {
	return useQuery(
		['me/player/devices'],
		() =>
			getAvailableDevices().then((devices) => {
				return devices.map(toDevice);
			}),
		opts
	);
};

export const usePlaybackState = (opts: QueryObserverOptions<PlaybackState>) => {
	return useQuery(['me/player'], () => getPlaybackState(), opts);
};

export const usePlaybackPause = (opts?: UseMutationOptions<void, unknown, string, unknown>) => {
	const queryClient = useQueryClient();

	return useMutation(['me/player/pause'], (deviceId: string) => playbackPause(deviceId), {
		...opts,
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries(['me/player']);
			opts?.onSuccess?.(data, variables, context);
		}
	});
};

export const usePlaybackStart = (
	opts?: UseMutationOptions<
		void,
		unknown,
		{
			deviceId: string;
			positionMs: number;
			offset?: { position: number };
			contextUri: string;
		},
		unknown
	>
) => {
	const queryClient = useQueryClient();

	return useMutation(
		['me/player/play'],
		(params: {
			deviceId: string;
			positionMs: number;
			contextUri: string;
			offset?: { position: number };
		}) => playbackStart(params.deviceId, params.positionMs, params.contextUri, params.offset),
		{
			...opts,
			onSuccess: (data, variables, context) => {
				queryClient.invalidateQueries(['me/player']);
				opts?.onSuccess?.(data, variables, context);
			}
		}
	);
};

export const usePlaybackSeekToPosition = (
	opts?: UseMutationOptions<void, unknown, { deviceId: string; positionMs: number }, unknown>
) => {
	const queryClient = useQueryClient();

	return useMutation(
		['me/player/seek'],
		(params: { deviceId: string; positionMs: number }) =>
			playbackSeekToPosition(params.deviceId, params.positionMs),
		{
			...opts,
			onSuccess: (data, variables, context) => {
				queryClient.invalidateQueries(['me/player']);
				opts?.onSuccess?.(data, variables, context);
			}
		}
	);
};

export const usePlaybackSkipNext = (opts?: UseMutationOptions<void, unknown, string, unknown>) => {
	const queryClient = useQueryClient();

	return useMutation(['me/player/next'], (deviceId: string) => playbackSkipNext(deviceId), {
		...opts,
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries(['me/player']);
			opts?.onSuccess?.(data, variables, context);
		}
	});
};

export const usePlaybackSkipPrevious = (
	opts?: UseMutationOptions<void, unknown, string, unknown>
) => {
	const queryClient = useQueryClient();

	return useMutation(['me/player/previous'], (deviceId: string) => playbackSkipPrevious(deviceId), {
		...opts,
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries(['me/player']);
			opts?.onSuccess?.(data, variables, context);
		}
	});
};

export const usePlaylists = (params: { limit: number; offset: number }) => {
	return useQuery(['me/playlists', params], () => getPlaylists(params));
};

export const usePlaybackVolume = (
	opts?: UseMutationOptions<void, unknown, { volume: number; deviceId: string }, unknown>
) => {
	const queryClient = useQueryClient();

	return useMutation(
		['me/player/volume'],
		(params: { volume: number; deviceId: string }) =>
			playbackSetVolume(params.volume, params.deviceId),
		{
			...opts,
			onSuccess: (data, variables, context) => {
				queryClient.invalidateQueries(['me/player']);
				opts?.onSuccess?.(data, variables, context);
			}
		}
	);
};

export const useTransferPlayback = (opts?: UseMutationOptions<void, unknown, string, unknown>) => {
	const queryClient = useQueryClient();

	return useMutation(['me/player'], (deviceId: string) => playbackTransfer(deviceId), {
		...opts,
		onSuccess: (data, variables, context) => {
			setTimeout(() => {
				queryClient.invalidateQueries(['me/player']);
				queryClient.invalidateQueries(['me/player/devices']);
			}, 500);
			opts?.onSuccess?.(data, variables, context);
		}
	});
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
