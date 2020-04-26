import './index.scss';
import * as Sky3D from './util/sky3d';
import { WEBGL } from './WEBGL';

let scene = new Sky3D.Scene(window.innerWidth, window.innerHeight);
scene.canvas.id = 'sky';
document.body.appendChild(scene.canvas);

let camera = new Sky3D.Camera();

// scene.add(new Sky3D.Mesh());

function animate() {
    requestAnimationFrame(animate);
    scene.render(camera);
}
if (WEBGL.isWebGLAvailable()) {
    animate();
} else {
    document.getElementById('error-message').innerHTML = WEBGL.getWebGLErrorMessage();
    document.getElementById('error-container').className = 'shown';
}
