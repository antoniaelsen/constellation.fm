import type { Object3D, Material } from 'three';
import type { ThrelteContext } from '@threlte/core';

export interface GraphData<NodeType = {}, LinkType = {}> {
	nodes: NodeObject<NodeType>[];
	links: LinkObject<NodeType, LinkType>[];
}

export type NodeObject<NodeType = {}> = NodeType & {
	id?: string | number;
	x?: number;
	y?: number;
	z?: number;
	vx?: number;
	vy?: number;
	vz?: number;
	fx?: number;
	fy?: number;
	fz?: number;
	[others: string]: any;
};

export type LinkObject<NodeType = {}, LinkType = {}> = LinkType & {
	source?: string | number | NodeObject<NodeType>;
	target?: string | number | NodeObject<NodeType>;
	[others: string]: any;
};

type Accessor<In, Out> = Out | string | ((obj: In) => Out);
export type NodeAccessor<NodeType, T> = Accessor<NodeObject<NodeType>, T>;
export type LinkAccessor<NodeType, LinkType, T> = Accessor<LinkObject<NodeType, LinkType>, T>;

export type DagMode = 'td' | 'bu' | 'lr' | 'rl' | 'zout' | 'zin' | 'radialout' | 'radialin';
export type ForceEngine = 'd3' | 'ngraph';

export interface ForceFn<NodeType = {}> {
	(alpha: number): void;
	initialize?: (nodes: NodeObject<NodeType>[], ...args: any[]) => void;
	[key: string]: any;
}

export type Coords = { x: number; y: number; z: number };

export type NodePositionUpdateFn = <NodeType = {}>(
	obj: Object3D,
	coords: Coords,
	node: NodeObject<NodeType>
) => void | null | boolean;
export type LinkPositionUpdateFn = <NodeType = {}, LinkType = {}>(
	obj: Object3D,
	coords: { start: Coords; end: Coords },
	link: LinkObject<NodeType, LinkType>
) => void | null | boolean;
