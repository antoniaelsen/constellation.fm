/// <reference types="@sveltejs/kit" />
import type { SpotifyAuth } from '$lib/types';

declare global {
	interface Window {
		Spotify: {
			Player: new (options: {
				name: string;
				getOAuthToken: (callback: (token: string) => void) => void;
				volume: number;
			}) => any;
		};
		onSpotifyWebPlaybackSDKReady: () => void;
	}

	namespace App {
		interface Session {
			spotify?: {
				webApi: SpotifyAuth | null;
				playbackApi: SpotifyAuth | null;
			};
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			spotify?: SpotifyAuth;
			userId?: string;
		}
	}
}

export {};
