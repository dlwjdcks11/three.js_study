import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: MeshNormalMaterial (normal === 법선)

export default function example() {
    // 텍스쳐 이미지 로드
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
        console.log('로드 시작');
    }
    loadingManager.onProgress = img => {
        console.log(img, '로딩중');
    }
    loadingManager.onLoad = () => {
        console.log('로드 완료');
    }
    loadingManager.onError = () => {
        console.log('에러');
    }

    const textureLoader = new THREE.TextureLoader(loadingManager);

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
    // const geometry = new THREE.ConeGeometry(1, 2, 128); // 반지름 높이 segment
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial({ // 그냥 예뻐서 사용하는 경우도 많다.
        // color: 'plum',
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
