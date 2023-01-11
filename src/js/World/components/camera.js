import { PerspectiveCamera } from "../../../../node_modules/three/build/three.module.js";

function createCamera() {
	const container = document.querySelector("#scene-container");
	const camera = new PerspectiveCamera(
		60,
		container.offsetWidth / container.offsetHeight,
		1,
		3000
	);

	camera.position.set(0, 0, 1000);

	return camera;
}

export { createCamera };
