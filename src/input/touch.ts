import { NightSky } from '../NightSky';
import { dist, midpoint } from '../util';
import { Inertia } from './Inertia';
import * as Pan from './pan';

interface ZoomLogFormat {
    amt: number,
    time: number
}

const panFactor = 0.0017;
const zoomFactor = 1.2;

let mode = 0; // 0 - None; 1 - Pan; 2 - Zoom
let panFinger: number;
let lastPos: number[];
let zoomFingers: number[];
let lastDist: number;
let zoomLog: Array<ZoomLogFormat> = [];
let zoomVel: Array<ZoomLogFormat> = [];

let zoomInertia = new Inertia();

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
    zoomFingers = [evt.touches[0].identifier, evt.touches[1].identifier];
    zoomLog = [];
    zoomVel = [];
    let touch1 = evt.touches[0];
    let touch2 = evt.touches[1];
    lastDist = dist([touch1.clientX, touch1.clientY], [touch2.clientX, touch2.clientY]);
    lastPos = midpoint([touch1.clientX, touch1.clientY], [touch2.clientX, touch2.clientY]);
};

function endZoom() {
    mode = 0;
    zoomFingers = undefined;
    lastDist = undefined;

    zoomVel = zoomVel.filter(({ time: t }) => Date.now() - t < 70);
    if (zoomVel.length <= 1) return;

    let zoomSpeed = zoomVel.reduce((acc, cur) => acc + cur.amt, 0) / zoomVel.length;

    let scrollOverlay = document.getElementById('scroll-overlay');
    zoomInertia.start(zoomSpeed, (delta) => { scrollOverlay.scrollBy(0, delta * 10); });
};

NightSky.attachToInitialization(function () {
    let scrollOverlay = document.getElementById('scroll-overlay');
    scrollOverlay.addEventListener('touchmove', (evt) => { evt.preventDefault() });

    window.addEventListener('touchstart', (evt) => {
        if (evt.touches.length === 1) {
            startPan.call(this, evt);
        } else if (evt.touches.length === 2) {
            zoomInertia.interrupt();
            startZoom.call(this, evt);
        }
    });

    window.addEventListener('touchmove', (evt) => {
        if (mode === 1) { // Panning
            let touch = Array.from(evt.touches).find((el) => el.identifier === panFinger);
            Pan.pan.call(
                this,
                touch.clientX, touch.clientY,
                (touch.clientY - lastPos[1]) * panFactor,
                (touch.clientX - lastPos[0]) * panFactor
            );
            lastPos = [touch.clientX, touch.clientY];
        } else if (mode === 2) { // Zooming
            let touch1 = Array.from(evt.touches).find((el) => el.identifier === zoomFingers[0]);
            let touch2 = Array.from(evt.touches).find((el) => el.identifier === zoomFingers[1]);
            let newDist = dist([touch1.clientX, touch1.clientY], [touch2.clientX, touch2.clientY]);
            scrollOverlay.scrollBy(0, (newDist - lastDist) * -zoomFactor);

            let prevAmt;
            if (prevAmt == undefined) {
                prevAmt = 0;
            } else {
                prevAmt = zoomLog[zoomLog.length - 1].amt;
            }

            zoomLog.push({
                amt: (newDist - lastDist) * -zoomFactor,
                time: Date.now()
            });
            if (zoomLog.length > 1) zoomVel.push({
                amt: (zoomLog[zoomLog.length - 1].amt + zoomLog[zoomLog.length - 2].amt) / (zoomLog[zoomLog.length - 1].time - zoomLog[zoomLog.length - 2].time),
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

    window.addEventListener('touchend', (evt) => {
        if (evt.touches.length === 1) { // Switch from zooming to panning
            endZoom.call(this);
        } else if (evt.touches.length === 0 && evt.changedTouches.length === 1) { // One finger lifted; stop panning
            endPan.call(this);
        } else if (evt.touches.length === 0 && evt.changedTouches.length === 2) { // Two fingers lifted; stop zooming
            endZoom.call(this);
            endPan.call(this);
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
});
