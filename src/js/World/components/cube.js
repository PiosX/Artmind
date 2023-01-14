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
		"https://images.prismic.io/miart/833582e4-f0dc-43d1-b4ab-6bc06d93fd4a_v9-min.png?auto=compress,format",
		"https://images.prismic.io/miart/15765374-345f-4c07-b1e1-7e4fa32698b2_v2-min.png?auto=compress,format",
		"https://images.prismic.io/miart/ef9e7b1e-1e4a-4879-a9e2-3395b1755e9f_v5-min.png?auto=compress,format",
		"https://images.prismic.io/miart/3401c2fe-5007-40c1-829f-321be5463231_v6-min.png?auto=compress,format",
		"https://images.prismic.io/miart/a920e94a-3f7e-42f1-927f-97b9eec316f5_v3-min.png?auto=compress,format",
		"https://images.prismic.io/miart/3bff197b-4d1b-44d0-87ce-acc57145d664_v1-min.png?auto=compress,format",
		"https://images.prismic.io/miart/f9357356-2116-42d8-a7fc-17230fa8041e_v7-min.png?auto=compress,format",
		"https://images.prismic.io/miart/9947e264-6513-4667-b794-155463952665_v8-min.png?auto=compress,format",
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
