import './index.scss';
import { skyGrid } from './skyGrid';
import WEBGL from './WEBGL';
import * as THREE from 'three';
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
let panVelocities: Array<{ vec: Vector2, time: number }> = [];
let curTime: number;
let panSpeed = 1300;
window.addEventListener('mousemove', (evt) => {
    if (evt.buttons === 1) {
        curTime = Date.now();
        rotCam(evt.movementY / panSpeed / camera.zoom, evt.movementX / panSpeed / camera.zoom);
        panVelocities.push({
            vec: new Vector2(evt.movementY / panSpeed / camera.zoom, evt.movementX / panSpeed / camera.zoom),
            time: Date.now()
        });
    }
});
let inertia: NodeJS.Timeout;
let doInertia = false;
let inertiaFactor = 0.03; // Smaller number -> takes longer to stop
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
        .filter(({ time: t }) => Date.now() - t < 50)
        .map(({ vec: v }) => Math.sqrt(v.x ** 2 + v.y ** 2))
        .reduce((total, i) => total + i, 0) / numSamples;

    panVelocity = panVelocities[panVelocities.length - 1].vec.normalize().multiplyScalar(panSpeed);

    let velDifference = panVelocity.clone().multiplyScalar(inertiaFactor);

    doInertia = true;
    inertia = setInterval(() => {
        panVelocity.sub(velDifference);
        velDifference.multiplyScalar(0.971); // Makes slowing down a lot smoother
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

let scrollOverlay = document.getElementById('scroll-overlay');
let scrollContent = document.getElementById('scroll-content');
let scrollMin = Math.log(0.4) / Math.log(1.003);
let scrollMax = Math.log(40) / Math.log(1.003);
scrollOverlay.scrollTo(0, scrollMax);
scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
setInterval(() => {
    camera.zoom = 1.003 ** (scrollMax - scrollOverlay.scrollTop);
    camera.updateProjectionMatrix();
}, 10);

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
