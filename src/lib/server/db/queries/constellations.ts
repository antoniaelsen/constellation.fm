import { and, eq, inArray, not, or, sql } from 'drizzle-orm';
import { db } from '../index';
import { constellations, edges, stars } from '../schema';
import type {
	Constellation,
	ConstellationPrototype,
	Edge,
	EdgePrototype,
	Provider,
	Star,
	StarPrototype
} from '$lib/types/constellations';

const constellationKey = (c: Pick<Constellation, 'userId' | 'provider' | 'providerPlaylistId'>) =>
	`${c.userId}:${c.provider}:${c.providerPlaylistId}`;

const constellationPrototypeKey =
	(userId: string) => (c: Pick<ConstellationPrototype, 'provider' | 'providerPlaylistId'>) =>
		`${userId}:${c.provider}:${c.providerPlaylistId}`;

const starKey = (
	s: Pick<Star, 'constellationId' | 'provider' | 'providerTrackId' | 'providerOrder'>
) => `${s.constellationId}:${s.provider}:${s.providerTrackId}:${s.providerOrder}`;

const starPrototypeKey =
	(userId: string) => (s: Pick<StarPrototype, 'provider' | 'providerTrackId' | 'providerOrder'>) =>
		`${userId}:${s.provider}:${s.providerTrackId}:${s.providerOrder}`;

export async function getConstellation(
	userId: string,
	constellationId: string
): Promise<Constellation | null> {
	if (!userId || !constellationId) {
		return null;
	}

	const constellation = await db
		.select()
		.from(constellations)
		.where(and(eq(constellations.userId, userId), eq(constellations.id, constellationId)))
		.limit(1);

	if (constellation.length === 0) {
		return null;
	}

	const constellationStars: Star[] = await db
		.select()
		.from(stars)
		.where(eq(stars.constellationId, constellation[0].id));

	const constellationEdges: Edge[] = await db
		.select()
		.from(edges)
		.where(eq(edges.constellationId, constellation[0].id));

	return {
		...constellation[0],
		stars: constellationStars,
		edges: constellationEdges
	};
}

export async function getConstellations(
	userId: string,
	options?: { offset?: number; limit?: number }
): Promise<Constellation[]> {
	if (!userId) {
		return [];
	}

	const offset = options?.offset || 0;
	const limit = options?.limit || -1;

	let query = db
		.select()
		.from(constellations)
		.where(eq(constellations.userId, userId))
		.orderBy(constellations.id)
		.offset(offset)
		.limit(limit);

	const userConstellations = await query;

	const results = await Promise.all(
		userConstellations.map(async (constellation): Promise<Constellation> => {
			const constellationStars: Star[] = await db
				.select()
				.from(stars)
				.where(eq(stars.constellationId, constellation.id));

			const constellationEdges: Edge[] = await db
				.select()
				.from(edges)
				.where(eq(edges.constellationId, constellation.id));

			return {
				id: constellation.id,
				userId: constellation.userId,
				provider: constellation.provider as Provider,
				providerPlaylistId: constellation.providerPlaylistId,
				stars: constellationStars,
				edges: constellationEdges
			};
		})
	);

	return results;
}

export async function getConstellationsByProviderId(
	userId: string,
	providerIds: { provider: Provider; providerPlaylistId: string }[]
): Promise<Constellation[]> {
	if (!userId) {
		return [];
	}

	let query = db
		.select()
		.from(constellations)
		.where(
			and(
				eq(constellations.userId, userId),
				or(
					...providerIds.map((pid) =>
						and(
							eq(constellations.provider, pid.provider),
							eq(constellations.providerPlaylistId, pid.providerPlaylistId)
						)
					)
				)
			)
		)
		.orderBy(constellations.id);

	const userConstellations = await query;

	const results = await Promise.all(
		userConstellations.map(async (constellation): Promise<Constellation> => {
			const constellationStars: Star[] = await db
				.select()
				.from(stars)
				.where(eq(stars.constellationId, constellation.id));

			const constellationEdges: Edge[] = await db
				.select()
				.from(edges)
				.where(eq(edges.constellationId, constellation.id));

			return {
				id: constellation.id,
				userId: constellation.userId,
				provider: constellation.provider as Provider,
				providerPlaylistId: constellation.providerPlaylistId,
				stars: constellationStars,
				edges: constellationEdges
			};
		})
	);

	return results;
}

export async function deleteConstellation(userId: string, constellationId: string) {
	await db
		.delete(constellations)
		.where(and(eq(constellations.userId, userId), eq(constellations.id, constellationId)));
}

/**
 * Sync stars for a constellation, adding new ones and removing old ones
 */
async function syncStars(
	userId: string,
	constellationId: string,
	newStars: StarPrototype[]
): Promise<Star[]> {
	const existing = await db.select().from(stars).where(eq(stars.constellationId, constellationId));
	const existingKeys = new Set(existing.map((star) => starKey(star as Star)));

	// insert new stars
	await Promise.all(
		newStars
			.filter((star) => !existingKeys.has(starPrototypeKey(userId)(star)))
			.map(async (sp) => {
				await db.insert(stars).values({
					constellationId,
					provider: sp.provider,
					providerTrackId: sp.providerTrackId,
					providerOrder: sp.providerOrder,
					isrc: sp.isrc
				});
			})
	);

	// delete old stars
	await db.delete(stars).where(
		and(
			eq(stars.constellationId, constellationId),
			not(
				inArray(
					sql`${stars.constellationId} || ':' || ${stars.provider} || ':' || ${stars.providerTrackId} || ':' || ${stars.providerOrder}`,
					newStars.map((star) => starPrototypeKey(userId)(star))
				)
			)
		)
	);

	return (await db
		.select()
		.from(stars)
		.where(eq(stars.constellationId, constellationId))) as Star[];
}

/**
 * Sync edges for a constellation, adding new ones and removing old ones
 */
async function syncEdges(userId: string, constellationId: string, newEdges: EdgePrototype[]) {
	const existing = await db
		.select({ id: constellations.id })
		.from(constellations)
		.where(and(eq(constellations.userId, userId), eq(constellations.id, constellationId)))
		.limit(1);
}

export async function syncConstellation(
	userId: string,
	constellationId: string,
	data: ConstellationPrototype
) {
	await syncStars(userId, constellationId, data.stars);
	await syncEdges(userId, constellationId, data.edges);
	return getConstellation(userId, constellationId);
}

/**
 * Sync constellations, adding new constellations ones and optionallyremoving old constellations
 */
export async function syncConstellations(
	userId: string,
	data: ConstellationPrototype[],
	remove = false
) {
	const existing: Pick<Constellation, 'id' | 'userId' | 'provider' | 'providerPlaylistId'>[] =
		await db
			.select({
				id: constellations.id,
				userId: constellations.userId,
				provider: constellations.provider,
				providerPlaylistId: constellations.providerPlaylistId
			})
			.from(constellations)
			.where(eq(constellations.userId, userId));

	const existingKeys = new Set(existing.map((e) => constellationKey(e)));
	const toCreate: ConstellationPrototype[] = data.filter(
		(p) => !existingKeys.has(constellationPrototypeKey(userId)(p))
	);

	if (toCreate.length > 0) {
		const values = toCreate.map((constellation) => ({
			userId,
			provider: constellation.provider,
			providerPlaylistId: constellation.providerPlaylistId
		}));
		await db.insert(constellations).values(values).onConflictDoNothing();
	}

	if (remove) {
		const newKeys = new Set(data.map((p) => constellationPrototypeKey(userId)(p)));
		const toDelete = existing.filter((e) => !newKeys.has(constellationKey(e)));
		await db.delete(constellations).where(
			inArray(
				constellations.id,
				toDelete.map((c) => c.id)
			)
		);
	}

	return getConstellationsByProviderId(userId, data);
}

export async function createEdge(constellationId: string, sourceId: string, targetId: string) {
	await db.insert(edges).values({ constellationId, sourceId, targetId });
}

export async function deleteEdge(constellationId: string, sourceId: string, targetId: string) {
	await db
		.delete(edges)
		.where(
			and(
				eq(edges.constellationId, constellationId),
				eq(edges.sourceId, sourceId),
				eq(edges.targetId, targetId)
			)
		);
}
