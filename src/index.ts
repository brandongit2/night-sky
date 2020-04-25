import * as THREE from 'three';
import './index.scss';
import WEBGL from './WEBGL';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry();
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

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
