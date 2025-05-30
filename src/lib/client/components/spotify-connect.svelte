<script>
	import { Button } from 'flowbite-svelte';

	let { class: className = '' } = $props();
</script>

<div class="flex flex-col items-center justify-center {className}">
	<form method="GET" action="/api/spotify/auth/login">
		<Button type="submit" aria-label="Connect Spotify">Connect Spotify</Button>
	</form>
</div>
