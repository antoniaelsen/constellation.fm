/// <reference types="@auth/sveltekit" />

import type { SpotifyAuth } from './lib/types';

declare global {
	namespace App {
		// interface Error {}
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
