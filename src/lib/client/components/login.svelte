<script>
	import { Button } from 'flowbite-svelte';

	let { class: className = '' } = $props();
</script>

<div class="flex flex-col items-center justify-center {className}">
	<form method="POST" action="api/auth/login">
		<input type="hidden" name="providerId" value="auth0" />
		<Button type="submit" aria-label="Sign In">Sign In</Button>
	</form>
</div>
