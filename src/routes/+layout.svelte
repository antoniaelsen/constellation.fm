<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { Avatar } from 'flowbite-svelte';

	import Login from '../lib/client/components/Login.svelte';
	import Toolbar from '../lib/client/components/Toolbar.svelte';
	import '../app.css';

	import { page } from '$app/stores';
	import SpotifyConnect from '$lib/client/components/SpotifyConnect.svelte';

	let { children } = $props();
	let session = $derived($page.data.session);
	let user = $derived(session?.user);
	let spotify = $derived(session?.spotify);

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<div class="flex h-screen w-screen flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
		{#if session}
			{#if !spotify?.webApi || !spotify?.playbackApi}
				<SpotifyConnect class="flex-grow" />
			{:else}
				{@render children()}

				<div class="fixed top-4 right-4">
					{#if user?.image}
						<Avatar src={user.image} alt="Profile picture" />
					{/if}
				</div>

				<div class="fixed top-4 left-1/2 -translate-x-1/2 transform">
					<Toolbar activeUrl={$page.url.pathname} />
				</div>
			{/if}
		{:else}
			<Login class="flex-grow" />
		{/if}
	</div>
</QueryClientProvider>
