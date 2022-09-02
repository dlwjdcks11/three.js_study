import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PreventDragClick } from './PreventDragClick';

// ----- 주제: 클릭한 Mesh 선택하기

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
    const mouse = new THREE.Vector2(); // 마우스는 클릭한 좌표가 평면이다. 따라서 Vector2

	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		// const delta = clock.getDelta();
		const time = clock.getElapsedTime(); // 계속 늘어나는 가변값이기 때문에 필요

		boxMesh.position.y = Math.sin(time) * 2;
		torusMesh.position.y = Math.cos(time) * 2;

		boxMesh.material.color.set('plum');
		torusMesh.material.color.set('lime');



		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

    const checkIntersects = () => {
        if (preventDragClick.mouseMoved) 
            return;

        raycaster.setFromCamera(mouse, camera); // 카메라에서부터 시작하는 광선. 자동으로 camera 위치를 origin으로 잡는다.

        const intersects = raycaster.intersectObjects(meshes);
        
        for (const item of intersects) {
            console.log(item.object.name); // 이 상태에서는 두 오브젝트가 겹쳤을 때 동시에 로그가 찍힌다. 관통하는 광선이기 때문
            break; // 이게 있어야 하나만 체크됨
        }
        // intersects[0].object.name으로 해도 된다. 근데 이렇게하면 빈 공간 클릭시 에러핸들링 필요
        // if (intersects[0])
        //     console.log(intersects[0].object.name); // 이런식으로

        // 위처럼 for문쓰나 아래꺼 쓰나 실행속도는 비슷하다. 기능은 같게 동작하니 편한걸로 쓰자.
        // 근데 이렇게 놔두면, 드래그시 문제가 생긴다. 빈공간 눌렀다가 뭐 위에 올리고 마우스 떼면 걔가 눌렸다고 판단됨. 이벤트 처리 필요
    }

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);
    canvas.addEventListener('click', (e) => {
        // e.clientX, e.clientY 
        // 마우스로 클릭한 곳의 x, y 좌표. 왼쪽 위가 0, 0이고, 오른쪽 아래가 제일 큰 값이다.
        // 하지만, three.js에서는 가운데가 0, 0이고 y가 위로 갈수록 커지고, x가 오른쪽으로 갈수록 커진다.
        mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
        mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
        // 이렇게 바꿔주면 three.js의 좌표계로 바뀐다.
        // console.log(mouse);

        checkIntersects();
    });

    const preventDragClick = new PreventDragClick(canvas); // 모듈 빼둔 클래스 생성

	draw();
}
