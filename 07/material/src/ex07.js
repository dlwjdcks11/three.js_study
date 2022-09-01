import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 로딩 매니저 (여러 개의 텍스처 이미지 로드)

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
    const baseColorTex = textureLoader.load('/textures/brick/Bricks_Terracotta_003_basecolor.jpg'); // Webpack 설정 필요
    const ambientTex = textureLoader.load('/textures/brick/Bricks_Terracotta_003_ambientOcclusion.jpg'); // Webpack 설정 필요
    const normalTex = textureLoader.load('/textures/brick/Bricks_Terracotta_003_normal.jpg'); // Webpack 설정 필요
    const heightTex = textureLoader.load('/textures/brick/Bricks_Terracotta_003_height.png'); // Webpack 설정 필요

    // const texture = textureLoader.load(
    //     '/textures/brick/Bricks_Terracotta_003_basecolor.jpg', 
    //     () => {
    //         console.log('로드 완료');
    //     },
    //     () => {
    //         console.log('로드중');
    //     },
    //     () => {
    //         console.log('로드 에러');
    //     }
    // );

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
	const material = new THREE.MeshStandardMaterial({ 
        map: baseColorTex,
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
