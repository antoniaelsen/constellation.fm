import type { Preview } from '@storybook/svelte';
import { themes } from '@storybook/theming';
import { withThemeByClassName } from '@storybook/addon-themes';
import BackgroundDecorator from '../src/stories/decorators/BackgroundDecorator.svelte';
import '../src/app.css';

const preview: Preview = {
	decorators: [
		() => BackgroundDecorator,
		withThemeByClassName({
			themes: {
				light: '',
				dark: 'dark'
			},
			defaultTheme: 'dark'
		})
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		docs: {
			theme: themes.dark
		}
	}
};

export default preview;
