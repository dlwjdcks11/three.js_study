import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';

// ----- 주제: PointLight

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    // 그림자 설정
    renderer.shadowMap.enabled = true; // 그림자를 할려면 일단 이걸 켜야 한다.
    // radius 쓸거면 shadowMap.type을 쓰면 안된다. 그냥 기본값으로 놔두면 된다는 뜻
    // renderer.shadowMap.type = THREE.PCFShadowMap; // 기본값
    // renderer.shadowMap.type = THREE.BasicShadowMap; // 거친 픽셀 그림자로 된다. 성능도 굳 밑의 width height 내려주면 더 픽셀처럼 된다.
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 살짝 더 부드럽다. 성능은 좀 떨어짐

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
	const ambientLight = new THREE.AmbientLight('white', 0.5); // 색, 강도 그냥 은은하게 깔아주는거라서 위치 속성 필요없다.
	// 근데 이 빛으로 하면 입체감이나 그림자가 하나도 없음.

	const light = new THREE.PointLight('white', 1, 100, 3); // 색, 강도, 빛이 영향을 미치는 최대 거리, decay(어둑어둑한 정도, 2가 적당)
	light.position.y = 3;
    light.castShadow = true; // 이 빛이 그림자를 만들 수 있는 빛이라고 선언

    // 그림자 퀄리티 올리기
    light.shadow.mapSize.width = 2048; // default 512
    light.shadow.mapSize.height = 2048; // default 512 올리면 올릴수록 그림자 엄청 선명하지만, 성능 박살남
    
    // 그림자 근평면, 원평면 설정 (최적화를 위함)
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 10; 
    // 그래도 너무 빡세게 잡진 말자. 짤리면 굉장히 부자연스러워 보인다.

    // 그림자에 blur 효과 주기
    light.shadow.radius = 15;

	const lightHelper = new THREE.PointLightHelper(light); // 시각적으로 조명이 어딨는지 보여준다.

	scene.add(light, ambientLight, lightHelper);

    // 그림자 설정

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Geometry
	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const planeGeometry = new THREE.PlaneGeometry(10, 10);
	const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);
	
	// Material
	const material1 = new THREE.MeshStandardMaterial({ color: 'white', });
	const material2 = new THREE.MeshStandardMaterial({ color: 'royalblue', });
	const material3 = new THREE.MeshStandardMaterial({ color: 'gold', });

	// Mesh
	const plane = new THREE.Mesh(planeGeometry, material1);
	const box = new THREE.Mesh(boxGeometry, material2);
	const sphere = new THREE.Mesh(sphereGeometry, material3);

	plane.rotation.x = -Math.PI * 0.5;
	box.position.set(1, 1, 0);
	sphere.position.set(-1, 1, 0);

    // 그림자 설정 (castShadow는 그림자를 만들 객체가, receiveShadow는 그림자를 받을 객체가 true로 바꾼다.)
    plane.receiveShadow = true;
    box.castShadow = true;
    box.receiveShadow = true;
    sphere.castShadow = true;
    sphere.receiveShadow = true;

	scene.add(plane, box, sphere);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// Dat GUI
	const gui = new dat.GUI();
	gui.add(light.position, 'x', -5, 5);
	gui.add(light.position, 'y', -5, 5);
	gui.add(light.position, 'z', -5, 5);

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta(); // draw가 찍히는 텀이라서 모두 일정한 값이다.
		const time = clock.getElapsedTime(); // 얘가 실제 수행시간. 계속 증가해야해서 이게 필요하다.

		light.position.x = Math.cos(time);
		light.position.z = Math.sin(time); // 원운동. 반지름이 1인걸 기준삼은거니까 반지름 늘릴려면 곱하기 해주면 된다.

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
