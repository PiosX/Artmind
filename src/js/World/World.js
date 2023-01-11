import { Vector2 } from "../../../../node_modules/three/build/three.module.js";
import { createCamera } from "./components/camera.min.js";
import { createCube } from "./components/cube.min.js";
import { createScene } from "./components/scene.min.js";

// import { createControls } from "./systems/controls.min.js";
import { createRenderer } from "./systems/renderer.min.js";
import { Resizer } from "./systems/Resizer.min.js";
import { Loop } from "./systems/Loop.min.js";

let renderer;
let scene;
let loop;

let mouse = new Vector2();
let target = new Vector2();
let windowHalf = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
let camera = createCamera();
let cube = createCube();

class World {
	constructor(container) {
		renderer = createRenderer();
		scene = createScene();
		loop = new Loop(camera, scene, renderer);
		container.append(renderer.domElement);

		// this.mousePosX = 0;
		// this.mousePosY = 0;
		// this.paramsIntensify = 0.2;
		// this.paramsEase = 0.08;
		// this.initZ = this.camera.position.z;

		this.mouse = new Vector2();
		this.target = new Vector2();
		this.windowHalf = new Vector2(
			window.innerWidth / 2,
			window.innerHeight / 2
		);

		// const controls = createControls(camera, renderer.domElement);

		// this.cube = createCube();

		loop.updatables.push(target, cube);

		target.tick = () => {
			target.x = (1 - mouse.x) * 0.00015;
			target.y = (-500 - mouse.y) * 0.00014;
		};
		cube.tick = () => {
			cube.rotation.x += 0.05 * (target.y - cube.rotation.x);
			cube.rotation.y += 0.05 * (target.x - cube.rotation.y);
		};

		scene.add(cube);

		// this.camParallax();

		document.addEventListener("mousemove", this.onMouseMove, false);

		const resizer = new Resizer(container, camera, renderer);
	}

	// camParallax() {
	// 	window.addEventListener("mousemove", (e) => {
	// 		this.mousePosX =
	// 			(e.clientX - window.innerWidth / 2) * this.paramsIntensify;
	// 		this.mousePosY =
	// 			(e.clientY - window.innerHeight / 2) * this.paramsIntensify;

	// 		this.camera.position.x +=
	// 			(this.mousePosX - this.camera.position.x) * this.paramsEase;
	// 		this.camera.position.y +=
	// 			(this.mousePosY - this.camera.position.y) * this.paramsEase;
	// 		this.camera.position.z +=
	// 			(this.initZ - this.camera.position.z) * this.paramsEase;
	// 		// this.camera.lookAt(0, 0, 900);
	// 	});
	// }

	onMouseMove(event) {
		mouse.x = event.clientX - windowHalf.x;
		mouse.y = event.clientY - windowHalf.x;
	}

	animate() {
		requestAnimationFrame(this.render);
	}

	render() {
		// draw a single frame
		renderer.render(scene, camera);
	}

	start() {
		loop.start();
	}

	stop() {
		loop.stop();
	}
}

export { World };
