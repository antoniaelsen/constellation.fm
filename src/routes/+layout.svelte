<script lang="ts">
	import { Avatar } from 'flowbite-svelte';

	import Login from '../lib/components/login.svelte';
	import Toolbar from '../lib/components/toolbar.svelte';
	import '../app.css';

	import { page } from '$app/stores';
	let { children } = $props();
	let session = $derived($page.data.session);
	let user = $derived(session?.user);
	$inspect(session);
</script>

<div class="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
	{#if $page.data.session}
		<div class="flex-grow">
			{@render children()}
		</div>

		<div class="fixed top-4 right-4">
			{#if user?.image}
				<Avatar src={user.image} alt="Profile picture" />
			{/if}
		</div>

		<div class="fixed bottom-4 left-1/2 -translate-x-1/2 transform">
			<Toolbar activeUrl={$page.url.pathname} />
		</div>
	{:else}
		<Login class="flex-grow" />
	{/if}
</div>
