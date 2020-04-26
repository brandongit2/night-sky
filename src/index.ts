import * as THREE from 'three';
import './index.scss';
import WEBGL from './WEBGL';
import { skyGrid } from './skyGrid';

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

window.addEventListener('mousemove', (evt) => {
    if (evt.buttons === 1) {
        camera.rotation.x += evt.movementY / 1500;
        camera.rotation.y += evt.movementX / 1500;
    }
})

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
if (WEBGL.isWebGLAvailable()) {
    animate();
} else {
    document.getElementById('error-message').innerHTML = WEBGL.getWebGLErrorMessage();
    document.getElementById('error-container').className = 'shown';
}
