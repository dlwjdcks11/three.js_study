import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 여러가지 텍스쳐가 적용된 큐브

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
    const rightTex = textureLoader.load('/textures/mcstyle/right.png'); // Webpack 설정 필요
    const leftTex = textureLoader.load('/textures/mcstyle/left.png'); // Webpack 설정 필요
    const topTex = textureLoader.load('/textures/mcstyle/top.png'); // Webpack 설정 필요
    const bottomTex = textureLoader.load('/textures/mcstyle/bottom.png'); // Webpack 설정 필요
    const frontTex = textureLoader.load('/textures/mcstyle/front.png'); // Webpack 설정 필요
    const backTex = textureLoader.load('/textures/mcstyle/back.png'); // Webpack 설정 필요

    const materials = [
        new THREE.MeshBasicMaterial({ map: rightTex, }),
        new THREE.MeshBasicMaterial({ map: leftTex, }),
        new THREE.MeshBasicMaterial({ map: topTex, }),
        new THREE.MeshBasicMaterial({ map: bottomTex, }),
        new THREE.MeshBasicMaterial({ map: frontTex, }),
        new THREE.MeshBasicMaterial({ map: backTex, }) // 순서 중요 우 좌 상 하 전 후
    ];

    rightTex.magFilter = THREE.NearestFilter; // 작은 사이즈의 texture의 픽셀을 살려서 만들고 싶을 때 사용하는 옵션.
    leftTex.magFilter = THREE.NearestFilter; // 작은 사이즈의 texture의 픽셀을 살려서 만들고 싶을 때 사용하는 옵션.
    topTex.magFilter = THREE.NearestFilter; // 작은 사이즈의 texture의 픽셀을 살려서 만들고 싶을 때 사용하는 옵션.
    bottomTex.magFilter = THREE.NearestFilter; // 작은 사이즈의 texture의 픽셀을 살려서 만들고 싶을 때 사용하는 옵션.
    frontTex.magFilter = THREE.NearestFilter; // 작은 사이즈의 texture의 픽셀을 살려서 만들고 싶을 때 사용하는 옵션.
    backTex.magFilter = THREE.NearestFilter; // 작은 사이즈의 texture의 픽셀을 살려서 만들고 싶을 때 사용하는 옵션.

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
        map: topTex,
	});
	const mesh = new THREE.Mesh(geometry, materials);
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
