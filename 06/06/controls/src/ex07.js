import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { KeyController } from './KeyController';

// ----- 주제: PointerLockControls에 키보드 컨트롤 추가(like 마인크래프트)

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
	camera.position.y = 1.5;
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
	const controls = new PointerLockControls(camera, renderer.domElement);
    // controls.lock(); // 이걸 유저 제스쳐를 통해 실행시켜야 제어 가능하다.
    // controls.domElement === renderer.domElement -> true
    controls.domElement.addEventListener('click', () => {
        controls.lock(); // 클릭을 하면 카메라 움직이기 가능하다.
    });
    controls.addEventListener('lock', () => {
        console.log('lock');
    })
    controls.addEventListener('unlock', () => {
        console.log('unlock');
    }) // 이런 이벤트 바인드도 가능하다.

    // 키보드 컨트롤(직접 만듬)
    const keyController = new KeyController();

    const walk = () => {
        if (keyController.keys['KeyW']) // W를 누르면 앞으로 간다.
            controls.moveForward(0.02);
        else if (keyController.keys['KeyA']) // A를 누르면 왼쪽으로 간다.
            controls.moveRight(-0.02);
        else if (keyController.keys['KeyS']) // S를 누르면 뒤로 간다.
            controls.moveForward(-0.02);
        else if (keyController.keys['KeyD']) // D를 누르면 오른쪽으로 간다.
            controls.moveRight(0.02);
        // 왼쪽, 뒤로 가는 함수가 없어서 각각 Right, Forward에서 부호만 반대로 해준다.
        // 방향키는 ArrowUp, ArrowRight... 이렇게 된다.
    }

	// Mesh
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	let mesh;
	let material;
	for (let i = 0; i < 20; i++) {
		material = new THREE.MeshStandardMaterial({
			color: `rgb(
				${50 + Math.floor(Math.random() * 205)}, 
				${50 + Math.floor(Math.random() * 205)}, 
				${50 + Math.floor(Math.random() * 205)})
			`, // 50 + 0 ~ 205 범위
		});
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = (Math.random() - 0.5) * 5;
		mesh.position.y = (Math.random() - 0.5) * 5;
		mesh.position.z = (Math.random() - 0.5) * 5; // -5 ~ 5
		scene.add(mesh);
	}

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

        walk(); // 이 안에서 뭐가 눌렸는지 체크해야 하기 때문에, 무한히 돌린다.

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
