import { NightSky } from '../NightSky';
import * as Input from './pan';

let panSpeed = 0.00062;

NightSky.attachToInitialization(function () {
    window.addEventListener('mousemove', (evt) => {
        if (evt.buttons === 1) {
            Input.pan.call(this, evt.clientX, evt.clientY, evt.movementY * panSpeed, evt.movementX * panSpeed);
        }
    });

    window.addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        Input.start.call(this);
    });

    window.addEventListener('mouseup', (evt) => {
        Input.release.call(this);
    });
});
