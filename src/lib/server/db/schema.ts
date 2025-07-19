import { DrizzleAdapter } from '@auth/drizzle-adapter';
import {
	boolean,
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	unique,
	bigint,
	pgEnum,
	jsonb
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { db } from '.';
import { Provider } from '../../types/constellations';
import { sql } from 'drizzle-orm';

export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const providerEnum = pgEnum('provider', enumToPgEnum(Provider));

export const users = pgTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name'),
	email: text('email').unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image')
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId]
			})
		}
	]
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(verificationToken) => [
		{
			compositePk: primaryKey({
				columns: [verificationToken.identifier, verificationToken.token]
			})
		}
	]
);

export const authenticators = pgTable(
	'authenticator',
	{
		credentialID: text('credentialID').notNull().unique(),
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		providerAccountId: text('providerAccountId').notNull(),
		credentialPublicKey: text('credentialPublicKey').notNull(),
		counter: integer('counter').notNull(),
		credentialDeviceType: text('credentialDeviceType').notNull(),
		credentialBackedUp: boolean('credentialBackedUp').notNull(),
		transports: text('transports')
	},
	(authenticator) => [
		{
			compositePK: primaryKey({
				columns: [authenticator.userId, authenticator.credentialID]
			})
		}
	]
);

export const spotifyConnections = pgTable('spotify_connections', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: 'cascade' }),
	accessToken: text('accessToken').notNull(),
	refreshToken: text('refreshToken').notNull(),
	tokenType: text('tokenType').notNull(),
	expires: bigint('expires', { mode: 'number' }).notNull(),
	scope: text('scope').notNull()
});

export const drizzleAdapter = DrizzleAdapter(db, {
	usersTable: users,
	accountsTable: accounts,
	sessionsTable: sessions,
	verificationTokensTable: verificationTokens
});

export const constellations = pgTable(
	'constellation',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: providerEnum('provider').notNull(),
		providerPlaylistId: text('providerPlaylistId').notNull()
	},
	(constellation) => ({
		uniqUserPlaylist: unique().on(
			constellation.userId,
			constellation.provider,
			constellation.providerPlaylistId
		)
	})
);

export const stars = pgTable(
	'star',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		constellationId: text('constellationId')
			.notNull()
			.references(() => constellations.id, { onDelete: 'cascade' }),
		provider: providerEnum('provider').notNull(),
		providerTrackId: text('providerTrackId').notNull(),
		providerOrder: integer('providerOrder').notNull(),
		providerTimestamp: timestamp({ mode: 'date' }).notNull(),
		isrc: text('isrc').notNull()
	},
	(star) => ({
		uniqConstellationTrack: unique().on(star.constellationId, star.provider, star.providerTrackId)
	})
);

export const edges = pgTable(
	'edge',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		constellationId: text('constellationId')
			.notNull()
			.references(() => constellations.id, { onDelete: 'cascade' }),
		sourceId: text('sourceId')
			.notNull()
			.references(() => stars.id, { onDelete: 'cascade' }),
		targetId: text('targetId')
			.notNull()
			.references(() => stars.id, { onDelete: 'cascade' })
	},
	(edge) => ({
		uniqConstellationEdge: unique().on(edge.constellationId, edge.sourceId, edge.targetId)
	})
);
