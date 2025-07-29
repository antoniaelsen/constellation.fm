import { writable } from 'svelte/store';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

interface CameraStore {
	controls: OrbitControls | null;
	isTracking: boolean;
	targetPosition: THREE.Vector3 | null;
}

export const cameraStore = writable<CameraStore>({
	controls: null,
	isTracking: true,
	targetPosition: null
});
