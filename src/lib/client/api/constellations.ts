import type { Constellation } from '$lib/types/constellations';
import {
	useQuery,
	type UseQueryOptions,
	type UseQueryStoreResult
} from '@sveltestack/svelte-query';
import { apiFetch } from './fetch';

const getConstellation = async (constellationId: string) => {
	const url = `/api/constellations/${constellationId}`;
	return apiFetch(url).then((res) => res.json());
};

const getConstellations = async (options?: {
	limit: number;
	offset: number;
}): Promise<Constellation[]> => {
	const params = new URLSearchParams();
	if (options?.limit !== undefined) params.append('limit', options.limit.toString());
	if (options?.offset !== undefined) params.append('offset', options.offset.toString());
	const query = params.toString();
	const url = `/api/constellations${query ? `?${query}` : ''}`;
	return apiFetch(url).then((res) => res.json());
};

export const useConstellation = (constellationId: string) => {
	return useQuery(['constellation', constellationId], () => getConstellation(constellationId));
};

export const useConstellations = (params: { limit: number; offset: number }) => {
	return useQuery(['constellations', params], () => getConstellations(params));
};

export const useAllConstellations = (
	opts?: UseQueryOptions<Constellation[]>
): UseQueryStoreResult<Constellation[]> => {
	const QUERY_KEY = 'constellations';

	return useQuery(
		QUERY_KEY,
		async () => {
			return await getConstellations();
		},
		opts
	);
};
