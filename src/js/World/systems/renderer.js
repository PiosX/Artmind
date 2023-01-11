import { WebGLRenderer } from "../../../../node_modules/three/build/three.module.js";

function createRenderer() {
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });

	renderer.physicallyCorrectLights = true;
	renderer.setClearColor(0x000000, 1);

	return renderer;
}

export { createRenderer };
