import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

import { colors } from './config.json';
import './index.scss';
import { inputOnRender } from './input/pan';
import { SkyObject } from './SkyObject';
import { WEBGL } from './WEBGL';

export class NightSky {
    static scene: THREE.Scene;
    static camera: THREE.PerspectiveCamera;
    static renderer: THREE.WebGLRenderer;
    static composer: EffectComposer;

    static fns_init: Array<() => void> = []; // A list of functions to run upon initialization
    static fns_render: Array<(time: number) => void> = []; // A list of functions to run on every render
    static fns_resize: Array<() => void> = []; // A list of functions to run upon window resize

    static skyObjects: SkyObject[] = [];

    static init() {
        let h = document.createElement('div');
        h.setAttribute('id', 'beepboop');
        h.style.width = '100px';
        h.style.height = '100px';
        document.getElementById('diagnostic').appendChild(h);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(parseInt(colors.sky, 16));

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 100);
        this.camera.rotation.order = 'YXZ';

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.setAttribute('id', 'main-canvas');
        document.body.appendChild(this.renderer.domElement);

        // Do FXAA
        let renderPass = new RenderPass(this.scene, this.camera);
        let fxaaPass = new ShaderPass(FXAAShader);
        // @ts-ignore
        fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * window.devicePixelRatio);
        // @ts-ignore
        fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * window.devicePixelRatio);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass(fxaaPass);

        for (let fn of this.fns_init) fn.call(this);

        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;

            // @ts-ignore
            fxaaPass.material.uniforms.resolution.value.x = 1 / (window.innerWidth * window.devicePixelRatio);
            // @ts-ignore
            fxaaPass.material.uniforms.resolution.value.y = 1 / (window.innerHeight * window.devicePixelRatio);

            for (let fn of this.fns_resize) fn();
        });

        let animate = (time: number) => {
            requestAnimationFrame(animate);

            for (let fn of this.fns_render) fn.call(this, time);
            inputOnRender.call(this);
            this.camera.updateProjectionMatrix();

            this.composer.render();
        }
        if (WEBGL.isWebGLAvailable()) {
            requestAnimationFrame(animate);
        } else {
            document.getElementById('error-message').innerHTML = WEBGL.getWebGLErrorMessage();
            document.getElementById('error-container').className = 'shown';
        }
    }

    static attachToInitialization(callback: () => void) {
        this.fns_init.push(callback);
    }

    static attachToRenderLoop(callback: (time: number) => void) {
        this.fns_render.push(callback);
    }

    static attachToResizeEvent(callback: () => void) {
        this.fns_resize.push(callback);
    }
}
