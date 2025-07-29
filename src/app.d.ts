/// <reference types="@sveltejs/kit" />
import 'unplugin-icons/types/svelte';

declare global {
	interface IntersectionEvent extends Intersection {
		nativeEvent: MouseEvent | PointerEvent | WheelEvent;
		stopPropagation: () => void;
	}

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
			user: {
				userId: string;
			} & DefaultSession['user'];
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
