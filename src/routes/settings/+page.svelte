<script lang="ts">
	import { SignOut } from '@auth/sveltekit/components';
	import { Heading, Hr, P, Card } from 'flowbite-svelte';
	import { page } from '$app/stores';
</script>

{#if $page.data.session}
	<div class="flex h-screen items-center justify-center p-4">
		<Card class="parent flex h-1/2 w-3/4 items-center justify-between p-4">
			<Heading class="text-[2rem] font-semibold">Settings</Heading>
			<Hr class="my-2" />
			<div class="flex-1"></div>
			<SignOut
				class="signout-button flex w-full items-stretch self-stretch"
				signOutPage="api/auth/logout"
			>
				<P aria-label="Sign out" class="text-center" slot="submitButton">Sign Out</P>
			</SignOut>
		</Card>
	</div>
{/if}

<style>
	:global(.signout-button) {
		width: 100%;
	}
	:global(.signout-button button) {
		background-color: --bg-primary-600;
		width: 100%;
	}
</style>
