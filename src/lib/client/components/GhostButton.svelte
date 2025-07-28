<script lang="ts">
	import { Button, type ButtonProps } from 'flowbite-svelte';

	interface Props extends Omit<ButtonProps, 'outline'> {}

	let { class: className = '', children, ...rest }: Props = $props();
</script>

<Button
	{...rest}
	class="border-none p-2! hover:border-none hover:bg-transparent! {className}"
	outline={true}
>
	{@render children()}
</Button>
