import { onDestroy } from 'svelte';
import * as THREE from 'three';

export function fromThree(
	ThreeComponent: any,
	{
		methodNames = [],
		initPropNames = []
	}: { methodNames?: string[]; initPropNames?: string[] } = {}
) {
	const threeObj = new ThreeComponent();

	methodNames.push('createNodeObject');

	onDestroy(() => {
		if (threeObj._destructor instanceof Function) {
			threeObj._destructor();
		}
	});

	const call = (method: string, ...args: any[]) => {
		if (threeObj[method] instanceof Function) {
			return threeObj[method](...args);
		}
		return undefined;
	};

	const methods = Object.fromEntries(
		methodNames.map((method) => [method, (...args: any[]) => call(method, ...args)])
	);

	const obj = {
		threeObj,
		...methods
	};

	return obj;
}
