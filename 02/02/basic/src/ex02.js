import * as THREE from 'three';

// 주제: 브라우저 창 사이즈 변경 대응
const example = () => {
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(window.devicePixelRatio); // 각 기기별로 해상도 밀도가 다르다.
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // 그냥 devicePixelRatio를 써도 되지만, 저렇게 하는게 성능상으로 유리하다고 한다.

    // Scene (무대)
    const scene = new THREE.Scene();

    // Perspective camera (정면 카메라, 원근법 적용됨, 자연스러운 시야)
    const camera = new THREE.PerspectiveCamera(
        75, // 시야각(FOV)
        window.innerWidth / window.innerHeight, // 종횡비(화면 해상도) 
        0.1, // near(절두체 근평면)
        1000 // far(절두체 원평면)
    );
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5; // 카메라를 주인공 자리에서 조금 떨어지게 둔다. 단위는 그냥 미터로 가정해도 무관
    scene.add(camera); // 카메라 scene에 추가

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

    // 이벤트
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    });
}

export default example;