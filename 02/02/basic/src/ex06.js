import * as THREE from 'three';

// 주제: 애니메이션 개선(시간에 따른 애니메이션이 아니라 다른 방법)
const example = () => {
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
        alpha: true, // 배경색 투명
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(window.devicePixelRatio); // 각 기기별로 해상도 밀도가 다르다.
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // 그냥 devicePixelRatio를 써도 되지만, 저렇게 하는게 성능상으로 유리하다고 한다.
    renderer.setClearColor(0x000000); // '#00FF00' 처럼도 ㄱㄴ

    // Scene (무대)
    const scene = new THREE.Scene();

    // Perspective camera (정면 카메라, 원근법 적용됨, 자연스러운 시야)
    const camera = new THREE.PerspectiveCamera(
        75, // 시야각(FOV)
        window.innerWidth / window.innerHeight, // 종횡비(화면 해상도) 
        0.1, // near(절두체 근평면)
        1000 // far(절두체 원평면)
    );
    camera.position.z = 5; // 카메라를 주인공 자리에서 조금 떨어지게 둔다. 단위는 그냥 미터로 가정해도 무관
    scene.add(camera); // 카메라 scene에 추가

    // light
    const light = new THREE.DirectionalLight(0xFFFFFF, 1); // 기본적으로 위에서 내리꽂는 빛이다. position 설정으로 방향 바꿈. 숫자는 빛의 세기
    light.position.x = 1;
    light.position.z = 2;
    scene.add(light);

    // Mesh = geometry + material
    const geometry = new THREE.BoxGeometry(1, 1, 1) // 가장 많이 쓰이는 좌표계
    const material = new THREE.MeshStandardMaterial({ // MeshBasicMaterial은 빛에 영향 X, 그래서 MeshStandardMaterial 쓴다
        // 색 외에도 많은 매개변수 들어갈 수 있음
        color: 0xFF0000, // css 컬러값도 넣을 수 있다. 'red', '#FF0000'등 모두 가능
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // render
    const clock = new THREE.Clock(); // 경과된 시간을 값으로 갖고 있다.
    const draw = () => {
        const delta = clock.getDelta(); // ElapsedTime과 Delta는 동시에 쓰면 안된다.
        // console.log(clock.getElapsedTime()); // 컴퓨터의 성능에 상관 없이 실제로 프로그램이 실행되고 지난 시간을 기록한다.
        // mesh.rotation.y += 0.1; // 라디안각 이용함.
        // mesh.rotation.y += THREE.MathUtils.degToRad(1); // 이건 360도계
        mesh.rotation.y += 2 * delta;
        mesh.position.y += delta;

        if (mesh.position.y > 3)
            mesh.position.y = 0;
        
        renderer.render(scene, camera);
        
        requestAnimationFrame(draw); // requestAnimationFrame은 window 전역객체의 함수이다. window 써도되고 안써도됨.
        // renderer.setAnimationLoop(draw); // requestAnimationFrame과 완벽하게 동일하게 동작한다. 근데 three.js를 이용하여 AR, VR(WebXR) 만들 때는 꼭 이거 써야함.
    }
    draw();

    // 이벤트
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    });
}

export default example;