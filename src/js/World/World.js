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
// import { gsap } from "./../../../node_modules/gsap/index.js";
import { gsap } from "./../../../node_modules/gsap/all.js";

let renderer;
let scene;
let loop;

let mouse = new Vector2();
let target = new Vector2();
let windowHalf = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
let camera = createCamera();
let cube = createCube();

let content = document.querySelectorAll(".content__subtitle");
let numbers = document.querySelectorAll(".counter__text");
let logoMain = document.querySelectorAll(".logo__main");
let sublogo = document.querySelectorAll(".logo__main__sub");
let mask = document.querySelector(".mask");

const collection = document.querySelectorAll(".about__table__row");
const close = document.querySelector(".about__close");
const about = document.querySelector(".about");
const aboutBtn = document.querySelector(".about__link");

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
		this.clickCounter = 0;
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
		this.logoAnimations();
		this.collectionEvent();
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
		this.gui.add(this.settings, "progress1", 0, 1, 0.01).onChange((val) => {
			this.effectPass.uniforms.uProgress.value = val;
		});
		mask.addEventListener("mousedown", this.settings.runAnimation);
		this.gui.hide();
	}

	collectionEvent() {
		collection.forEach((item) => {
			item.addEventListener("mouseover", () => {
				item.lastElementChild.lastElementChild.style.display = "block";
			});
			item.addEventListener("mouseout", () => {
				item.lastElementChild.lastElementChild.style.display = "none";
			});
		});

		close.addEventListener("mousedown", () => {
			gsap.to(about, {
				transform: "translateX(100%)",
				duration: 1.3,
			});
		});
		mask.addEventListener("mousedown", () => {
			gsap.to(about, {
				transform: "translateX(100%)",
				duration: 1.3,
			});
		});
		aboutBtn.addEventListener("mousedown", () => {
			gsap.to(about, {
				transform: "translateX(0)",
				duration: 1.3,
			});
		});
	}

	runAnimation() {
		mask.style.display = "none";
		setTimeout(() => {
			mask.style.display = "block";
		}, 2000);

		if (this.clickCounter != 8) {
			this.clickCounter++;
		} else {
			this.clickCounter = 0;
		}

		let tl = gsap.timeline();
		if (this.clickCounter == 0) {
			for (let i = 0; i < content.length; i++) {
				content[i].style.opacity = "0";
			}
			this.conAnimation(content[0], content[8]);
			gsap.to(numbers[7], { opacity: 0, duration: 2 });
			gsap.to(numbers[8], { opacity: 0, duration: 2 });
			this.numberAnim(numbers[0]);
		}
		if (this.clickCounter == 1) {
			this.conAnimation(content[1], content[0]);
			this.numberAnim(numbers[1]);
		}
		if (this.clickCounter == 2) {
			this.conAnimation(content[2], content[1]);
			this.numberAnim(numbers[2]);
		}
		if (this.clickCounter == 3) {
			this.conAnimation(content[3], content[2]);
			this.hideNum(numbers[0]);
			this.hideNum(numbers[1]);
			this.numberAnim(numbers[3]);
			gsap.to(numbers[2], { x: "-5rem", duration: 2 });
		}
		if (this.clickCounter == 4) {
			this.conAnimation(content[4], content[3]);
			gsap.fromTo(
				numbers[2],
				{ x: "-5rem", duration: 1 },
				{ x: "-8rem", opacity: 0 }
			);
			gsap.to(numbers[3], { x: "-4rem", duration: 2 });
		}
		if (this.clickCounter == 5) {
			this.conAnimation(content[5], content[4]);
			this.numberAnim(numbers[5]);
		}
		if (this.clickCounter == 6) {
			this.conAnimation(content[6], content[5]);
			this.numberAnim(numbers[6]);
		}
		if (this.clickCounter == 7) {
			this.conAnimation(content[7], content[6]);
			this.numberAnim(numbers[7]);
		}
		if (this.clickCounter == 8) {
			this.conAnimation(content[8], content[7]);
			this.numberAnim(numbers[8]);
			this.hideNum(numbers[3]);
			this.hideNum(numbers[6]);
			this.hideNum(numbers[5]);
			gsap.to(numbers[7], { x: "-8rem", duration: 2 });
		}

		if (camera.position.x == 20000) {
			tl.to(camera.position, {
				x: 0,
				duration: 1.5,
				ease: "power4.inOut",
			});
		} else {
			tl.to(camera.position, {
				x: camera.position.x + 2500,
				duration: 1.5,
				ease: "power4.inOut",
			});
		}

		// tl.to(
		// 	camera.position,
		// 	{
		// 		z: 700,
		// 		duration: 1,
		// 		ease: "power4.inOut",
		// 	},
		// 	0
		// );
		// tl.to(
		// 	camera.position,
		// 	{
		// 		z: 900,
		// 		duration: 1,
		// 		ease: "power4.inOut",
		// 	},
		// 	1
		// );

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

	logoAnimations() {
		logoMain.forEach((logo) => {
			gsap.to(logo, {
				transform: "translate(-50%,-50%) rotate(-45deg)",
				duration: 0.5,
				delay: 2,
			});
			gsap.to(logo, {
				transform: "translate(-50%,-50%) rotate(0)",
				duration: 0.5,
				delay: 4,
			});
			gsap.to(logo, {
				transform: "translate(-50%,-50%) rotate(45deg)",
				duration: 0.5,
				delay: 6,
			});
			gsap.to(logo, {
				transform: "translate(-50%,-50%) rotate(0)",
				duration: 0.5,
				delay: 8,
			});
		});

		gsap.to(sublogo[0], {
			transform: "translate(-50%,-50%) rotate(-45deg)",
			duration: 0.5,
			delay: 2,
		});
		gsap.to(sublogo[1], {
			transform: "translate(-50%,-50%) rotate(0)",
			duration: 0.5,
			delay: 4,
		});
		gsap.to(sublogo[2], {
			transform: "translate(-50%,-50%) rotate(45deg)",
			duration: 0.5,
			delay: 6,
		});
		sublogo.forEach((logo) => {
			gsap.to(logo, {
				transform: "translate(-50%,-50%) rotate(0)",
				duration: 0.5,
				delay: 8,
			});
		});

		setInterval(() => {
			logoMain.forEach((logo) => {
				gsap.to(logo, {
					transform: "translate(-50%,-50%) rotate(-45deg)",
					duration: 0.5,
					delay: 2,
				});
				gsap.to(logo, {
					transform: "translate(-50%,-50%) rotate(0)",
					duration: 0.5,
					delay: 4,
				});
				gsap.to(logo, {
					transform: "translate(-50%,-50%) rotate(45deg)",
					duration: 0.5,
					delay: 6,
				});
				gsap.to(logo, {
					transform: "translate(-50%,-50%) rotate(0)",
					duration: 0.5,
					delay: 8.5,
				});
			});
			gsap.to(sublogo[0], {
				transform: "translate(-50%,-50%) rotate(-45deg)",
				duration: 0.5,
				delay: 2,
			});
			gsap.to(sublogo[1], {
				transform: "translate(-50%,-50%) rotate(0)",
				duration: 0.5,
				delay: 4,
			});
			gsap.to(sublogo[2], {
				transform: "translate(-50%,-50%) rotate(45deg)",
				duration: 0.5,
				delay: 6,
			});
			sublogo.forEach((logo) => {
				gsap.to(logo, {
					transform: "translate(-50%,-50%) rotate(0)",
					duration: 0.5,
					delay: 8.5,
				});
			});
		}, 9000);
	}

	conAnimation(item, itemOut) {
		item.style.display = "block";
		itemOut.style.display = "none";
		itemOut.style.opacity = "0";
		let tl = gsap.timeline();
		tl.to(item, { opacity: 1, duration: 2 });
	}

	numberAnim(target) {
		gsap.fromTo(
			target,
			{ opacity: 0, x: "20rem" },
			{ opacity: 1, x: "0", duration: 2 }
		);
	}

	hideNum(target) {
		gsap.fromTo(
			target,
			{ opacity: 1, x: "0" },
			{ opacity: 0, x: "-8rem", duration: 2 }
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
				target.x = (1 - mouse.x) * 0.00013;
				target.y = (-500 - mouse.y) * 0.00013;
				item.rotation.x += 0.05 * (target.y - item.rotation.x);
				item.rotation.y += 0.05 * (target.x - item.rotation.y);

				// item.children.forEach((m, i) => {
				// 	m.position.z = (i + 1) * 100 - this.oscilator * 200;
				// });
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
