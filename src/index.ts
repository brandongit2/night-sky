import * as THREE from 'three';
import './index.scss';
import WEBGL from './WEBGL';
import { skyGrid } from './skyGrid';
import { Vector2 } from 'three';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

let gridLines = skyGrid();
for (let line of gridLines) {
    scene.add(line);
}

function rotCam(dx: number, dy: number) { // Rotates camera without going past -90° or +90° latitude
    let newXRot = camera.rotation.x + dx;
    if (newXRot > -Math.PI / 2 && newXRot < Math.PI / 2) camera.rotation.x = newXRot;
    camera.rotation.y += dy;
}

let panVelocity: Vector2;
let panVelocities: Vector2[] = [];
let curTime: number;
window.addEventListener('mousemove', (evt) => {
    if (evt.buttons === 1) {
        curTime = Date.now();
        rotCam(evt.movementY / 1500, evt.movementX / 1500);
        panVelocities.push(new Vector2(evt.movementY / 1500, evt.movementX / 1500));
    }
});
let inertia: NodeJS.Timeout;
let doInertia = false;
let inertiaFactor = 0.02; // Smaller number -> takes longer to stop
window.addEventListener('mousedown', () => {
    panVelocities = [];
    doInertia = false;
    clearInterval(inertia);
});

window.addEventListener('mouseup', () => {
    // If there are less than 10 samples for the whole mouse movement, don't use 10
    let numSamples = panVelocities.length < 10 ? panVelocities.length : 10;

    // Get average speed of mouse movement
    let panSpeed = panVelocities.slice(-numSamples)
        .map(v => Math.sqrt(v.x ** 2 + v.y ** 2))
        .reduce((total, i) => total + i, 0) / numSamples;

    panVelocity = panVelocities[panVelocities.length - 1].normalize().multiplyScalar(panSpeed);
    console.log(panSpeed);

    let velDifference = panVelocity.clone().multiplyScalar(inertiaFactor);
    // console.log(Date.now() - curTime);
    if (Date.now() - curTime > 50) return;

    doInertia = true;
    inertia = setInterval(() => {
        panVelocity.sub(velDifference);
        velDifference.multiplyScalar(0.981); // Makes slowing down a lot smoother
        if (
            (velDifference.x > 0 && panVelocity.x < 0)
            || (velDifference.x < 0 && panVelocity.x > 0)
            || (velDifference.y > 0 && panVelocity.y < 0)
            || (velDifference.y < 0 && panVelocity.y > 0)
            || (velDifference.x === 0 && velDifference.y === 0)
            || (panVelocity.x === 0 && panVelocity.y === 0)
        ) {
            clearInterval(inertia);
            doInertia = false;
        }
    }, 10);
});

function animate() {
    requestAnimationFrame(animate);

    if (doInertia) rotCam(panVelocity.x, panVelocity.y);

    renderer.render(scene, camera);
}
if (WEBGL.isWebGLAvailable()) {
    animate();
} else {
    document.getElementById('error-message').innerHTML = WEBGL.getWebGLErrorMessage();
    document.getElementById('error-container').className = 'shown';
}
