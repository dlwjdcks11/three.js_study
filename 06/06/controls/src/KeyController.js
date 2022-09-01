export class KeyController {
    constructor() { // 클래스의 인스턴스가 생성될 때 자동 실행
        this.keys = [];

        window.addEventListener('keydown', e => {
            console.log(e.code, '누름');
            this.keys[e.code] = true; // w를 눌렀다면, e.code === 'KeyW'
        });
        window.addEventListener('keyup', e => {
            console.log(e.code, '땜');
            delete this.keys[e.code];
        });
    }
}