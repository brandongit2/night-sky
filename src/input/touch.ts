import * as Pan from './pan';
import { dist, midpoint, avg } from '../util';

const panFactor = 0.0017;
const zoomFactor = 1.2;
const zoomInertiaFactor = 0.03;

let mode = 0; // 0 - None; 1 - Pan; 2 - Zoom
let panFinger: number;
let lastPos: number[];
let zoomFingers: number[];
let lastDist: number;
let amtZoomed: Array<{ amt: number, time: number }> = [];
let zoomInertia: NodeJS.Timeout;

function startPan(evt: TouchEvent) {
    mode = 1;
    panFinger = evt.touches[0].identifier;
    lastPos = [evt.touches[0].clientX, evt.touches[0].clientY];
    Pan.start.call(this);
};

function endPan() {
    mode = 0;
    panFinger = undefined;
    lastPos = undefined;
    Pan.release.call(this);
}

function startZoom(evt: TouchEvent) {
    mode = 2;
    amtZoomed = [];
    zoomFingers = [evt.touches[0].identifier, evt.touches[1].identifier];
    let touch1 = evt.touches[0];
    let touch2 = evt.touches[1];
    lastDist = dist([touch1.clientX, touch1.clientY], [touch2.clientX, touch2.clientY]);
    lastPos = midpoint([touch1.clientX, touch1.clientY], [touch2.clientX, touch2.clientY]);
};

function endZoom() {
    mode = 0;
    zoomFingers = undefined;
    lastDist = undefined;

    clearInterval(zoomInertia);

    let scrollOverlay = document.getElementById('scroll-overlay');

    // Get average speed of mouse movement
    amtZoomed = amtZoomed.filter(({ time: t }) => Date.now() - t < 30);
    if (amtZoomed.length <= 1 || amtZoomed[amtZoomed.length - 1].time - amtZoomed[0].time === 0) return;

    let zoomSpeed = (amtZoomed[amtZoomed.length - 1].amt - amtZoomed[0].amt)
        / (amtZoomed[amtZoomed.length - 1].time - amtZoomed[0].time);
    let speedDifference = -zoomSpeed * zoomInertiaFactor;

    zoomInertia = setInterval(() => {
        scrollOverlay.scrollBy(0, zoomSpeed);
        zoomSpeed += speedDifference;
        speedDifference *= 0.98;
        if ((speedDifference < 0 && zoomSpeed < 0) || (speedDifference > 0 && zoomSpeed > 0)) {
            clearInterval(zoomInertia);
            zoomInertia = undefined;
        }
    }, 10);
};

export function touchInit() {
    let scrollOverlay = document.getElementById('scroll-overlay');
    scrollOverlay.addEventListener('touchmove', (evt) => { evt.preventDefault() });

    window.addEventListener('touchmove', (evt) => {
        if (mode === 1) {
            let touch = Array.from(evt.touches).find((el) => el.identifier === panFinger);
            Pan.pan.call(
                this,
                touch.clientX, touch.clientY,
                (touch.clientY - lastPos[1]) * panFactor,
                (touch.clientX - lastPos[0]) * panFactor
            );
            lastPos = [touch.clientX, touch.clientY];
        } else if (mode === 2) {
            let touch1 = Array.from(evt.touches).find((el) => el.identifier === zoomFingers[0]);
            let touch2 = Array.from(evt.touches).find((el) => el.identifier === zoomFingers[1]);
            let newDist = dist([touch1.clientX, touch1.clientY], [touch2.clientX, touch2.clientY]);
            scrollOverlay.scrollBy(0, (newDist - lastDist) * -zoomFactor);
            let prevAmt = amtZoomed[amtZoomed.length - 1]?.amt;
            if (prevAmt == undefined) prevAmt = 0;
            amtZoomed.push({
                amt: prevAmt + (newDist - lastDist) * -zoomFactor,
                time: Date.now()
            });
            lastDist = newDist;

            // Panning continues in zoom mode using the midpoint of the two fingers.
            let mid = midpoint([touch1.clientX, touch1.clientY], [touch2.clientX, touch2.clientY]);
            Pan.pan.call(
                this,
                mid[0], mid[1],
                (mid[1] - lastPos[1]) * panFactor,
                (mid[0] - lastPos[0]) * panFactor
            );
            lastPos = mid;
        }
    });

    window.addEventListener('touchstart', (evt) => {
        if (evt.touches.length === 1) {
            startPan.call(this, evt);
        } else if (evt.touches.length === 2) {
            startZoom.call(this, evt);
        }
    });

    window.addEventListener('touchend', (evt) => {
        if (evt.touches.length === 1) { // Switch from zooming to panning
            endZoom.call(this);
            startPan.call(this, evt);
        } else if (evt.touches.length === 0 && evt.changedTouches.length === 1) { // One finger lifted; stop panning
            endPan.call(this);
        } else if (evt.touches.length === 0 && evt.changedTouches.length === 2) { // Two fingers lifted; stop zooming
            endZoom.call(this);
        } else if (evt.touches.length > 2) { // Check if finger lifted was a zoomFinger
            if (Array.from(evt.changedTouches).find(({ identifier }) => identifier === zoomFingers[0])) {
                zoomFingers[0] = Array.from(evt.touches)
                    .find(({ identifier }) => !zoomFingers.includes(identifier))
                    .identifier;
            } else if (Array.from(evt.changedTouches).find(({ identifier }) => identifier === zoomFingers[1])) {
                zoomFingers[1] = Array.from(evt.touches)
                    .find(({ identifier }) => !zoomFingers.includes(identifier))
                    .identifier;
            }
        }
    });
}
