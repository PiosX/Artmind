import {
	Group,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	TextureLoader,
} from "../../../../node_modules/three/build/three.module.js";

function createCube() {
	let textures = [
		"https://images.prismic.io/miart/cb52f3b6-14a4-4406-9e2e-b0f03e032c88_v4-min.png?auto=compress,format",
		"https://images.prismic.io/miart/cb52f3b6-14a4-4406-9e2e-b0f03e032c88_v4-min.png?auto=compress,format",
	];
	let maskTexture = new TextureLoader().load(
		"https://images.prismic.io/miart/7dadf32d-3571-4822-8c56-421921ae94b2_mask.jpg?auto=compress,format"
	);
	textures = textures.map((t) => new TextureLoader().load(t));

	const geometry = new PlaneGeometry(1920, 1280, 1, 1);
	let group = new Group();
	for (let i = 0; i < 3; i++) {
		let material = new MeshBasicMaterial({ map: textures[0] });

		if (i > 0) {
			material = new MeshBasicMaterial({
				map: textures[0],
				alphaMap: maskTexture,
				transparent: true,
			});
		}

		let mesh = new Mesh(geometry, material);
		mesh.position.z = (i + 1) * 100;

		group.add(mesh);
	}

	return group;
}

export { createCube };
