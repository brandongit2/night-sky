import './index.scss';
import { mouse, onRender } from './mouse';
import { skyGrid } from './skyGrid';
import WEBGL from './WEBGL';
import * as THREE from 'three';

class NightSky {
    static scene: THREE.Scene;
    static camera: THREE.PerspectiveCamera;
    static renderer: THREE.WebGLRenderer;

    static init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.rotation.order = 'YXZ';

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        let gridLines = skyGrid();
        for (let line of gridLines) {
            this.scene.add(line);
        }

        mouse.call(this);

        let animate = () => {
            requestAnimationFrame(animate);

            onRender.call(this);

            this.renderer.render(this.scene, this.camera);
        }
        if (WEBGL.isWebGLAvailable()) {
            animate();
        } else {
            document.getElementById('error-message').innerHTML = WEBGL.getWebGLErrorMessage();
            document.getElementById('error-container').className = 'shown';
        }
    }
}

NightSky.init();
