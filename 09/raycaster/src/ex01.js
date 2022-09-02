import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ----- 주제: 특정 방향의 광선에 맞은 Mesh 판별하기

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
	camera.position.x = 5;
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
	const conttrols = new OrbitControls(camera, renderer.domElement);

	// Mesh
	const lineMaterial = new THREE.LineBasicMaterial({ color: 'yellow', }); // 기본적인 선 material
	const points = [];
	points.push(new THREE.Vector3(0, 0, 100));
	points.push(new THREE.Vector3(0, 0, -100));
	
	const lineGeometry = new THREE.BufferGeometry().setFromPoints(points) // 점 두개를 위치잡고, 이어줌.
	const guide = new THREE.Line(lineGeometry, lineMaterial); // 그걸로 만든 raytracing용 선
	scene.add(guide);

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 'plum' });
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	boxMesh.name = 'box';

	const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
	const torusMaterial = new THREE.MeshStandardMaterial({ color: 'lime' });
	const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
	torusMesh.name = 'torus';
	
	scene.add(boxMesh, torusMesh);

	const meshes = [boxMesh, torusMesh];

	// raycaster
	const raycaster = new THREE.Raycaster();

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta();
		const time = clock.getElapsedTime(); // 계속 늘어나는 가변값이기 때문에 필요

		boxMesh.position.y = Math.sin(time) * 2;
		torusMesh.position.y = Math.cos(time) * 2;

		boxMesh.material.color.set('plum');
		torusMesh.material.color.set('lime');

		const origin = new THREE.Vector3(0, 0, 100); // 광선을 쏘는 출발점. 여기서는 시각적으로 보이는 선의 시작점을 잡아준다.
		const direction = new THREE.Vector3(0, 0, -1); // origin에서 어디로 쏠건지 방향. 단위벡터로 써줘야 작동한다.(정규화된 방향)
		// direction.normalize() // 만약 단위벡터를 모르겠다면 그냥 끝점 쓰고 이걸 쓰면 된다.
		raycaster.set(origin, direction);

		const intersects = raycaster.intersectObjects(meshes);
		intersects.forEach(item => {
			// console.log(item.object.name); // 지정해둔 이름 출력됨
			item.object.material.color.set('red'); // 레이캐스트 맞은애 색깔 바뀜
		});

		// console.log(raycaster.intersectObjects(meshes)); 
		// 이거 실행하면 배열 2개짜리가 출력되는데, torus(도넛 모양)가 맞은게 아니라 정육면체의 두 면이 맞아서 두 개가 나오는 것

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
