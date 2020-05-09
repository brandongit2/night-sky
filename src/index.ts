import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

import { colors } from './config.json';
import { coordinateLabels } from './coordinateLabels';
import './index.scss';
import { mouse, mouseOnRender, mouseOnResize } from './mouse';
import { skyGrid, skyGridOnResize } from './skyGrid';
import { WEBGL } from './WEBGL';

class NightSky {
    static scene: THREE.Scene;
    static camera: THREE.PerspectiveCamera;
    static renderer: THREE.WebGLRenderer;
    static composer: EffectComposer;

    static init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(parseInt(colors.sky, 16));

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 100);
        this.camera.rotation.order = 'YXZ';

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        let renderPass = new RenderPass(this.scene, this.camera);
        let fxaaPass = new ShaderPass(FXAAShader);
        // @ts-ignore
        fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * window.devicePixelRatio);
        // @ts-ignore
        fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * window.devicePixelRatio);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass(fxaaPass);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);

            // @ts-ignore
            fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * window.devicePixelRatio);
            // @ts-ignore
            fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * window.devicePixelRatio);

            skyGridOnResize();
            mouseOnResize.call(this);
        });

        let gridLines = skyGrid();
        for (let line of gridLines) {
            this.scene.add(line);
        }

        mouse.call(this);

        let animate = () => {
            requestAnimationFrame(animate);

            mouseOnRender.call(this);
            coordinateLabels.call(this);

            this.composer.render();
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
