import {
	DefaultResponseDeserializer,
	type AccessToken,
	type ICachable,
	type ICachingStrategy,
	type IValidateResponses,
	type SdkOptions
} from '@spotify/web-api-ts-sdk';
import { error } from '@sveltejs/kit';
import { createHash } from 'crypto';

import { logger } from '$lib/stores/logger';

const LOGGER = logger.child({
	module: 'api-spotify-client'
});

const CACHE_STALE_TIME_MS = 5 * 60 * 1000;

const CACHE_BLACKLIST_PATTERNS = [
	/\/me\/player/,
	/\/me\/player\/currently-playing/,
	/\/me\/player\/devices/,
	/\/me\/player\/repeat/,
	/\/me\/player\/shuffle/,
	/\/me\/player\/play/,
	/\/me\/player\/pause/,
	/\/me\/player\/next/,
	/\/me\/player\/previous/
];

const CACHE_CUSTOM_STALE_TIMES = [
	{ pattern: /\/me\/playlists/, staleTimeMs: 5 * 60 * 1000 }, // TODO: 10s
	{ pattern: /\/playlists\/[^/]+$/, staleTimeMs: 5 * 60 * 1000 },
	{ pattern: /\/me$/, staleTimeMs: 10 * 60 * 1000 }
];

interface CachedResponse {
	response: Response;
	timestamp: number;
	body: ArrayBuffer;
}

export interface SpotifyError extends Error {
	cause: {
		code: number;
	};
}

class LRUCache implements ICachingStrategy {
	private cache = new Map<string, any>();
	private maxSize: number;

	constructor(maxSize = 1000) {
		this.maxSize = maxSize;
	}

	async getOrCreate<T>(
		cacheKey: string,
		createFunction: () => Promise<T & ICachable & object>,
		updateFunction?: (item: T) => Promise<T & ICachable & object>
	): Promise<T & ICachable> {
		const cached = this.cache.get(cacheKey);
		if (cached !== undefined) {
			this.cache.delete(cacheKey);
			this.cache.set(cacheKey, cached);

			if (updateFunction) {
				const updated = await updateFunction(cached);
				this.setCacheItem(cacheKey, updated);
				return updated;
			}
			return cached;
		}

		const created = await createFunction();
		this.setCacheItem(cacheKey, created);
		return created;
	}

	async get<T>(cacheKey: string): Promise<(T & ICachable) | null> {
		const value = this.cache.get(cacheKey);
		if (value !== undefined) {
			this.cache.delete(cacheKey);
			this.cache.set(cacheKey, value);
			return value;
		}
		return null;
	}

	setCacheItem<T>(cacheKey: string, item: T & ICachable): void {
		if (this.cache.has(cacheKey)) {
			this.cache.delete(cacheKey);
		} else if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (!firstKey) {
				return;
			}
			this.cache.delete(firstKey);
		}
		this.cache.set(cacheKey, item);
	}

	remove(cacheKey: string): void {
		this.cache.delete(cacheKey);
	}
}

export class ResponseDeserializer extends DefaultResponseDeserializer {
	public async deserialize<TReturnType>(response: Response): Promise<TReturnType> {
		const text = await response.text();

		// The spotify Web API returns text for some endpoints that the SDK would otherwise try to parse as JSON.
		// This is a workaround to prevent the SDK from throwing an error.
		const BLACKLIST_PARSE = [
			'https://api.spotify.com/v1/me/player/repeat',
			'https://api.spotify.com/v1/me/player/seek',
			'https://api.spotify.com/v1/me/player/shuffle',
			'https://api.spotify.com/v1/me/player/next',
			'https://api.spotify.com/v1/me/player/pause',
			'https://api.spotify.com/v1/me/player/play',
			'https://api.spotify.com/v1/me/player/previous',
			'https://api.spotify.com/v1/me/player/volume'
		];
		const blacklisted = BLACKLIST_PARSE.some((url) => response.url.startsWith(url));

		if (text.length > 0) {
			if (blacklisted) {
				return text as TReturnType;
			}

			try {
				const json = JSON.parse(text);
				return json as TReturnType;
			} catch (err) {
				throw new Error(`Failed to parse JSON: ${err}`, { cause: { code: 500 } });
			}
		}

		return null as TReturnType;
	}
}

export class ResponseValidator implements IValidateResponses {
	private async _validateResponse(response: Response): Promise<void> {
		switch (response.status) {
			case 401:
				throw new Error(
					'Bad or expired token. This can happen if the user revoked a token or the access token has expired. You should re-authenticate the user.',
					{ cause: { code: 401 } }
				);
			case 403: {
				const body = await response.text();
				throw new Error(
					`Bad OAuth request (wrong consumer key, bad nonce, expired timestamp...). Unfortunately, re-authenticating the user won't help here. Body: ${body}`,
					{ cause: { code: 403 } }
				);
			}
			case 429: {
				const retryAfter = response.headers.get('Retry-After');
				throw new Error(`The app has exceeded its rate limits; retry after ${retryAfter} seconds`, {
					cause: { code: 429 }
				});
			}
			default:
				if (!response.status.toString().startsWith('20')) {
					const body = await response.text();
					throw new Error(
						`Unexpected error: (${response.status}) - ${response.statusText}${body ? `\n${body}` : ''}`,
						{ cause: { code: response.status } }
					);
				}
				break;
		}
	}

	public async validateResponse(response: Response): Promise<void> {
		try {
			await this._validateResponse(response);
		} catch (err) {
			const spotifyErr = err as SpotifyError;
			LOGGER.error(
				`Request failed: ${spotifyErr.cause?.code} - ${spotifyErr.message} ("${response.url}")`
			);
			throw error(spotifyErr.cause?.code ?? 500, spotifyErr);
		}
	}
}

function getUserIdFromToken(tokens: AccessToken): string {
	return createHash('sha256').update(tokens.access_token).digest('hex').substring(0, 16);
}

function createCacheKey(url: string, options: RequestInit, userId: string): string {
	const method = options.method || 'GET';
	const sortedHeaders = Object.entries(options.headers || {})
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => `${key}:${value}`)
		.join('|');

	return `${userId}:${method}:${url}:${sortedHeaders}`;
}

function shouldCache(url: string, init?: RequestInit): boolean {
	if (init?.method !== 'GET') {
		return false;
	}

	const endpoint = url.replace('https://api.spotify.com/v1', '');
	return !CACHE_BLACKLIST_PATTERNS.some((pattern) => pattern.test(endpoint));
}

function getStaleTimeForUrl(url: string): number {
	const customStaleTime = CACHE_CUSTOM_STALE_TIMES.find(({ pattern }) => pattern.test(url));
	return customStaleTime ? customStaleTime.staleTimeMs : CACHE_STALE_TIME_MS;
}

function createCachingFetch(cache: ICachingStrategy, tokens: AccessToken): typeof fetch {
	const userId = getUserIdFromToken(tokens);

	return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
		const url = typeof input === 'string' ? input : input.toString();
		const options = init || {};

		if (!shouldCache(url, init)) {
			return fetch(input, init);
		}

		const cacheKey = createCacheKey(url, options, userId);
		const cached = await cache.get<CachedResponse>(cacheKey);
		const age = cached ? Date.now() - cached.timestamp : null;

		if (cached) {
			const staleTime = getStaleTimeForUrl(url);

			if (age && age < staleTime) {
				return new Response(cached.body, {
					status: cached.response.status,
					statusText: cached.response.statusText,
					headers: cached.response.headers
				});
			}
		}

		const response = await fetch(input, init);
		if (response.ok && response.status === 200) {
			try {
				const body = await response.arrayBuffer();
				const cachedResponse: CachedResponse & ICachable = {
					response: {
						status: response.status,
						statusText: response.statusText,
						headers: Object.fromEntries(response.headers.entries())
					} as any,
					timestamp: Date.now(),
					body
				};

				cache.setCacheItem(cacheKey, cachedResponse);

				return new Response(body, {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers
				});
			} catch {
				return response;
			}
		}

		return response;
	};
}

const sharedCache = new LRUCache(1000);

export function createSpotifyOptions(tokens: AccessToken): SdkOptions {
	return {
		beforeRequest: (url, options) => {
			LOGGER.trace(`[${options.method}] ${url}`, options);
		},
		afterRequest: (url, options, response) => {
			LOGGER.info(`[${options.method}] ${url} ${response.status} ${response.statusText}`, options);
		},
		cachingStrategy: sharedCache,
		deserializer: new ResponseDeserializer(),
		responseValidator: new ResponseValidator(),
		fetch: createCachingFetch(sharedCache, tokens)
	};
}
