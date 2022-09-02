export class PreventDragClick {
    constructor(elem) { // elem은 canvas
        this.mouseMoved; // 마우스가 움직였는지 t/f
        
        let clickStartX;
        let clickStartY;
        let clickStartTime; // 얘네는 멤버함수들만 쓸거니까 상관 ㄴ
        elem.addEventListener('mousedown', (e) => {
            clickStartX = e.clientX;
            clickStartY = e.clientY;
            clickStartTime = Date.now();
        });
        elem.addEventListener('mouseup', (e) => {
            const xGap = Math.abs(e.clientX - clickStartX);
            const yGap = Math.abs(e.clientY - clickStartY);
            const timeGap = Date.now() - clickStartTime;

            if (xGap > 5 || yGap > 5 || timeGap > 500) // 최초 클릭지점에서 뗀 지점까지의 거리가 5px 이상이거나 0.5초 이상이 걸렸다면, 클릭으로 취급하지 않는다.
                this.mouseMoved = true;
            else
                this.mouseMoved = false;
        })
    }
}