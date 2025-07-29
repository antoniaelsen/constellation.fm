<script lang="ts">
	import { Button, type ButtonProps } from 'flowbite-svelte';

	let { class: className = '', children, ...rest }: ButtonProps = $props();
</script>

<Button
	{...rest}
	class="border-none p-2! hover:border-none hover:bg-transparent! {className}"
	outline={true}
>
	{@render children?.()}
</Button>
