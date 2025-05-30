export const fadeIn = (node: Element, { duration = 200 }) => ({
	duration,
	css: (t: number) => `opacity: ${t}`
});
