import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: Geometry 기본

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	// const geometry = new THREE.BoxGeometry(1, 1, 1, 16, 16, 16); 
	// 한 개의 사각형 또는 도형이 몇 개의 사각형으로 분할되었을지를 표시한다. wireframe 속성을 true로 주면 확인 가능하다.
	// segment를 나눈다는 것은 vertex를 추가한 것과 동일하다. 이걸로 여러 효과를 줄 수 있다.
	// 자세한건 공식 독스에서 geometry 참조
	// 원, 원기둥 원뿔 등에서 segment를 줄이면 삼각형 까지 줄어든다. 사실상 원은 n이 무한히 큰 n각형으로 간주한다.

	const material = new THREE.MeshStandardMaterial({
		color: 'hotpink',
		// wireframe: true, // 뼈대만 남기고 싶을 때
		// side: THREE.DoubleSide // 기본적으로 three.js의 Material은 밖에서만 보인다. 이걸 하면 mesh 안에서도 벽이 보임.
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
