import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 각지게 표현하기

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
	directionalLight.position.set(1, 0, 2);
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement); // 알아서 lookAt으로 바라본다.

	// Mesh
	const geometry = new THREE.SphereGeometry(1, 16, 16);
    
    // Standard는 반사광이 있긴 한데, shininess 조절이 없고, roughness가 있다. 0에 가까우면 가까울수록 맨들맨들해진다.
	const material1 = new THREE.MeshStandardMaterial({ 
		color: 'seagreen',
        roughness: 0.2,
        flatShading: true, // 각지게 표현이 가능하다.
        metalness: 0.3, // 조금 더 금속같아 보이게. 많이 쎄지면 시꺼매짐. 올리면 올릴수록 시꺼매진다.
	});

    // Phong은 하이라이트나 반사광이 있는 유광 재질 like 당구공 (광 정도 조정 가능) Standard보다 빠르다.
    const material2 = new THREE.MeshPhongMaterial({ 
		color: 'seagreen',
        shininess: 1000, // 반사광 정도 조절 가능
        flatShading: true, // 각지게 표현이 가능하다.
	}); 
    // 성능은 Lambert가 더 좋다.
    
	const mesh1 = new THREE.Mesh(geometry, material1);
	const mesh2 = new THREE.Mesh(geometry, material2);
    mesh1.position.x = -1.5;
    mesh2.position.x = 1.5;
	scene.add(mesh1, mesh2);

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
