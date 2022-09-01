import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 텍스처 이미지 변환(위치, 회전)

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
    const texture = textureLoader.load('/textures/skull/Ground Skull_basecolor.jpg'); // Webpack 설정 필요

    // 텍스쳐 변환
    texture.wrapS = THREE.RepeatWrapping; // 좌우 늘어나는건 얘가 알아서 픽셀 반복으로 채움
    texture.wrapT = THREE.RepeatWrapping; // 좌우 늘어나는건 얘가 알아서 픽셀 반복으로 채움
    // texture.offset.x = 0.3; // 이걸 그냥 두면 픽셀이 쭉 늘어나서 채움
    // texture.offset.y = 0.3;

    // texture.repeat.x = 2; // x 방향으로 이미지 2개 들어가는게 한 변인 것으로 인식한다.
    // texture.repeat.y = 2; // y 방향으로 이미지 2개 들어가는게 한 패턴인 것으로 인식한다.

    // texture.rotation = Math.PI * 0.25; // 1/4파이만큼 돌아간다.
    texture.rotation = THREE.MathUtils.degToRad(90); // 동일

    // 그냥 돌리면 우리가 원하는대로 중앙을 기준으로 돌리는 형태가 아니다. center.x와 center.y를 0.5로 맞춰주면 중심 중앙으로 맞춰진다.
    texture.center.x = 0.5;
    texture.center.y = 0.5;

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
        map: texture,
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
