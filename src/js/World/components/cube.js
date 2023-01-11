import {
	Group,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	TextureLoader,
} from "../../../../node_modules/three/build/three.module.js";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/ShaderPass.js";

function createCube() {
	let textures = [
		"https://images.prismic.io/miart/cb52f3b6-14a4-4406-9e2e-b0f03e032c88_v4-min.png?auto=compress,format",
		"https://images.prismic.io/miart/833582e4-f0dc-43d1-b4ab-6bc06d93fd4a_v9-min.png?auto=compress,format",
	];
	let maskTexture = new TextureLoader().load(
		"https://images.prismic.io/miart/7dadf32d-3571-4822-8c56-421921ae94b2_mask.jpg?auto=compress,format"
	);
	textures = textures.map((t) => new TextureLoader().load(t));

	const geometry = new PlaneGeometry(1920, 1280, 1, 1);
	let groups = [];
	textures.forEach((t, j) => {
		let group = new Group();
		groups.push(group);
		for (let i = 0; i < 3; i++) {
			let material = new MeshBasicMaterial({ map: t });

			if (i > 0) {
				material = new MeshBasicMaterial({
					map: t,
					alphaMap: maskTexture,
					transparent: true,
				});
			}

			let mesh = new Mesh(geometry, material);
			mesh.position.z = (i + 1) * 100;

			group.add(mesh);
			group.position.x = j * 2500;
		}
	});

	return { groups };
}

export { createCube };
