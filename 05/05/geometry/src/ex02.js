import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: Geometry 정점(vertex) 이용하기

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
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 'orangered',
        side: THREE.DoubleSide,
        flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    // geometry.attributes.position.array를 찍어보면 배열이 나오는데, vertex 개수에 x3을 한 크기의 배열이다. 순서대로 x, y, z, x, y, z... 순이다.
    const positionArray = geometry.attributes.position.array;
    const randomArray = [];
    for (let i = 0; i < positionArray.length; i += 3) {
        // 정점(vertex) 한개의 x, y, z 좌표를 랜덤으로 조정한다.
        positionArray[i] += (Math.random() - 0.5) * 0.2;// x좌표
        positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
        positionArray[i + 2] += (Math.random() - 0.5) * 0.2;
        
        randomArray[i] = (Math.random() - 0.5) * 0.2;
        randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
        randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
    }
    scene.add(mesh);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();
        const time = clock.getElapsedTime() * 3;

        for (let i = 0; i < positionArray.length; i += 3) {
            // 정점(vertex) 한개의 x, y, z 좌표를 랜덤으로 조정한다.
            positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.002;// x좌표
            positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.002;
            positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.002;
        }

        geometry.attributes.position.needsUpdate = true; // 값 설정 가능

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
