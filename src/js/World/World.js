import { Vector2 } from "../../../../node_modules/three/build/three.module.js";
import { createCamera } from "./components/camera.min.js";
import { createCube } from "./components/cube.min.js";
import { createScene } from "./components/scene.min.js";

import { createControls } from "./systems/controls.min.js";
import { createRenderer } from "./systems/renderer.min.js";
import { Resizer } from "./systems/Resizer.min.js";
import { Loop } from "./systems/Loop.min.js";
import { CurtainShader } from "./components/effect.min.js";
import { RGBAShader } from "./components/effect2.min.js";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/ShaderPass.js";
import { GUI } from "./../../../node_modules/dat.gui/build/dat.gui.module.js";
import { gsap } from "./../../../node_modules/gsap/index.js";

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
		this.initPost();
		this.render();
		cube.groups.forEach((item) => {
			scene.add(item);
		});

		this.time = 0;

		// const controls = createControls(camera, renderer.domElement);
		// loop.updatables.push(controls);

		this.mouse = new Vector2();
		this.target = new Vector2();
		this.windowHalf = new Vector2(
			window.innerWidth / 2,
			window.innerHeight / 2
		);

		document.addEventListener("mousemove", this.onMouseMove, false);
		this.resizer = new Resizer(container, camera, renderer, this.composer);

		this.settings();
	}

	settings() {
		let that = this;
		this.settings = {
			progress: 0,
			progress1: 0,
			runAnimation: () => {
				this.runAnimation();
			},
		};
		this.gui = new GUI();
		this.gui.add(this.settings, "progress", 0, 1, 0.01);
		this.gui.add(this.settings, "progress1", 0, 1, 0.01).onChange((val) => {
			this.effectPass.uniforms.uProgress.value = val;
		});
		this.gui.add(this.settings, "runAnimation");
	}

	runAnimation() {
		let tl = gsap.timeline();

		tl.to(camera.position, {
			x: camera.position.x + 2500,
			duration: 1.5,
			ease: "power4.inOut",
		});

		tl.to(
			camera.position,
			{
				z: 700,
				duration: 1,
				ease: "power4.inOut",
			},
			0
		);
		tl.to(
			camera.position,
			{
				z: 900,
				duration: 1,
				ease: "power4.inOut",
			},
			1
		);

		tl.to(
			this.effectPass.uniforms.uProgress,
			{
				value: 1,
				duration: 1,
				ease: "power3,inOut",
			},
			0
		);
		tl.to(
			this.effectPass.uniforms.uProgress,
			{
				value: 0,
				duration: 1,
				ease: "power3,inOut",
			},
			1
		);

		tl.to(
			this.effectPass1.uniforms.uProgress,
			{
				value: 1,
				duration: 1,
				ease: "power3,inOut",
			},
			0
		);
		tl.to(
			this.effectPass1.uniforms.uProgress,
			{
				value: 0,
				duration: 1,
				ease: "power3,inOut",
			},
			1
		);
	}

	initPost() {
		this.composer = new EffectComposer(renderer);

		const renderPass = new RenderPass(scene, camera);
		this.composer.addPass(renderPass);

		this.effectPass = new ShaderPass(CurtainShader);
		this.composer.addPass(this.effectPass);
		this.effectPass1 = new ShaderPass(RGBAShader);
		this.composer.addPass(this.effectPass1);
	}

	onMouseMove(event) {
		mouse.x = event.clientX - windowHalf.x;
		mouse.y = event.clientY - windowHalf.x;
	}

	render() {
		requestAnimationFrame(this.render.bind(this));

		this.time += 0.05;
		this.oscilator = Math.sin(this.time * 0.1) * 0.5 + 0.5;

		renderer.setAnimationLoop(() => {
			cube.groups.forEach((item) => {
				target.x = (1 - mouse.x) * 0.00015;
				target.y = (-500 - mouse.y) * 0.00014;
				item.rotation.x += 0.05 * (target.y - item.rotation.x);
				item.rotation.y += 0.05 * (target.x - item.rotation.y);

				item.children.forEach((m, i) => {
					m.position.z = (i + 1) * 100 - this.oscilator * 200;
				});
			});

			this.composer.render();
		});
		// renderer.render(scene, camera);
	}

	start() {
		loop.start();
	}

	stop() {
		loop.stop();
	}
}

export { World };
