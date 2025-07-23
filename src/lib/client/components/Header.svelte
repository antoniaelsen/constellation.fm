<script>
	import { Toolbar, ToolbarButton } from 'flowbite-svelte';
	import { QuestionCircleOutline, RocketOutline, ToolsOutline } from 'flowbite-svelte-icons';

	let { activeUrl } = $props();
</script>

<Toolbar>
	<ToolbarButton
		class={{ 'text-primary-600 hover:text-primary-700': activeUrl === '/about' }}
		href="/about"
	>
		<QuestionCircleOutline class="h-6 w-6" />
	</ToolbarButton>
	<ToolbarButton
		class={{ 'text-primary-600 hover:text-primary-700': activeUrl === '/constellations' }}
		href="/constellations"
	>
		<RocketOutline class="h-6 w-6" />
	</ToolbarButton>
	<ToolbarButton
		class={{ 'text-primary-600 hover:text-primary-700': activeUrl === '/settings' }}
		href="/settings"
	>
		<ToolsOutline class="h-6 w-6" />
	</ToolbarButton>
</Toolbar>
