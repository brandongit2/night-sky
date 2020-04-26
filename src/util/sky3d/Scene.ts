import { Camera } from "./Camera";
import { SceneObject } from './SceneObject';

export class Scene {
    canvas: HTMLCanvasElement;

    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas');
        this.setSize(width, height);
    }

    add(object: SceneObject) {

    }

    setSize(width: number, height: number) {
        this.canvas.width = width * window.devicePixelRatio;
        this.canvas.height = height * window.devicePixelRatio;
    }

    render(camera: Camera) {

    }
}
