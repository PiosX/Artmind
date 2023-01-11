import { Vector2 } from "../../../../node_modules/three/build/three.module.js";
import { createCamera } from "./components/camera.min.js";
import { createCube } from "./components/cube.min.js";
import { createScene } from "./components/scene.min.js";

import { createControls } from "./systems/controls.min.js";
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

		const controls = createControls(camera, renderer.domElement);
		loop.updatables.push(controls);

		this.mouse = new Vector2();
		this.target = new Vector2();
		this.windowHalf = new Vector2(
			window.innerWidth / 2,
			window.innerHeight / 2
		);
		cube.groups.forEach((item) => {
			loop.updatables.push(target, item);

			target.tick = () => {
				target.x = (1 - mouse.x) * 0.00015;
				target.y = (-500 - mouse.y) * 0.00014;
			};
			item.tick = () => {
				item.rotation.x += 0.05 * (target.y - item.rotation.x);
				item.rotation.y += 0.05 * (target.x - item.rotation.y);
			};

			scene.add(item);
		});
		// scene.add(cube.groups[0]);
		// scene.add(cube.groups[1]);

		document.addEventListener("mousemove", this.onMouseMove, false);

		const resizer = new Resizer(container, camera, renderer);
	}

	initPost() {
		this.composer = new EffectComposer(renderer);
	}

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
