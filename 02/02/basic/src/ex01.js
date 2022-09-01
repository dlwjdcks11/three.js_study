import * as THREE from 'three';

// 주제: 기본적인 카메라, 씬, 메쉬
const example = () => {
    // 동적 캔버스 조립
    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement); // HTML에 canvas 요소를 만들어두고 그걸 만지는게 더 낫다.

    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene (무대)
    const scene = new THREE.Scene();

    // Perspective camera (정면 카메라, 원근법 적용됨, 자연스러운 시야)
    // const camera = new THREE.PerspectiveCamera(
    //     75, // 시야각(FOV)
    //     window.innerWidth / window.innerHeight, // 종횡비(화면 해상도) 
    //     0.1, // near(절두체 근평면)
    //     1000 // far(절두체 원평면)
    // );
    // camera.position.x = 1;
    // camera.position.y = 2;
    // camera.position.z = 5; // 카메라를 주인공 자리에서 조금 떨어지게 둔다. 단위는 그냥 미터로 가정해도 무관
    // scene.add(camera); // 카메라 scene에 추가

    // Orthographic camera (직교 카메라, 원근법 X, 디아블로, 롤등의 탑뷰 게임에서 많이 쓰임)
    const camera = new THREE.OrthographicCamera(
        -(window.innerWidth / window.innerHeight), // left
        window.innerWidth / window.innerHeight, // right
        1, // top
        -1, // bottom
        0.1, // near
        1000, // far
    ) // 여기는 절두체가 육면이다.
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5; // 카메라를 주인공 자리에서 조금 떨어지게 둔다. 단위는 그냥 미터로 가정해도 무관
    camera.lookAt(0, 0, 0);
    camera.zoom = 0.5; // 2D는 zoomout 할 때 이거 만져줘야 한다.
    camera.updateProjectionMatrix(); // 카메라 속성을 직접 만졌다면 이거 호출해야한다.
    scene.add(camera);

    // Mesh = geometry + material
    const geometry = new THREE.BoxGeometry(1, 1, 1) // 가장 많이 쓰이는 좌표계
    const material = new THREE.MeshBasicMaterial({
        // 색 외에도 많은 매개변수 들어갈 수 있음
        color: 0xFF0000, // css 컬러값도 넣을 수 있다. 'red', '#FF0000'등 모두 가능
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // render
    renderer.render(scene, camera);
}

export default example;