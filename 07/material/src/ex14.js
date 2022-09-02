import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: EnvironmentMap (feat. polyhaven)
// HDR 받아서 HDR to cubemap 해야한다.

export default function example() {
    // 텍스쳐 이미지 로드
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const envTex = cubeTextureLoader
        .setPath('/textures/cubemap/')
        .load([
            // + ~ - 순서 (p가 positive, n이 negative)
            // 각 쌍은 + 먼저, x y z 순서대로
            'px.png', 'nx.png',
            'py.png', 'ny.png',
            'pz.png', 'nz.png'
        ]);

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
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.set(1, 0, 2);
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement); // 알아서 lookAt으로 바라본다.

	// Mesh
	const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
	// const material = new THREE.MeshStandardMaterial({ 
        envMap: envTex,
        
        // 환경 안에 mesh를 놓고, 그 mesh에 비춰지는 듯한 느낌을 줄 수 있다.
        // basic이 조금 더 선명하다.
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
