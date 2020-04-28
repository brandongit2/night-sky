// Handles panning and zooming of camera

import * as THREE from 'three';
import { Ray, Vector2 } from 'three';

let doInertia = false;
let panVelocity: Vector2;

function rotCam(dx: number, dy: number) { // Rotates camera without going past -90° or +90° latitude
    let newXRot = this.camera.rotation.x + dx;
    if (newXRot > -Math.PI / 2 && newXRot < Math.PI / 2) this.camera.rotation.x = newXRot;
    this.camera.rotation.y += dy;
}

export function mouse() {
    let panVelocities: Array<{ vec: Vector2, time: number }> = [];
    let panSpeed = 1300;
    // a and b are parameters which have been tweaked precisely! Do not touch!
    let a = 20;
    let b = 1.05;
    window.addEventListener('mousemove', (evt) => {
        if (evt.buttons === 1) {
            let pos = [
                2 * evt.clientX / window.innerWidth - 1,
                -(2 * evt.clientY / window.innerHeight - 1)
            ];
            let ray = new Ray();
            let vec = ray.direction.set(pos[0], pos[1], -1).unproject(this.camera).normalize();

            /* Without adj, moving the mouse horizontally (changing the yaw of the camera) would be too slow when zoomed
             * in to the poles (try setting adj to 1 to see what this looked like). To compensate for this, I divide by
             * adj1. However, this overcompensates when not zoomed in. To compensate it back, I use the maximum of adj1
             * and adj2. Don't worry about the math. */
            let adj1 = Math.sqrt(vec.x ** 2 + vec.z ** 2);
            let adj2 = (((40 - this.camera.zoom) / 39) ** a - 1 + b) / b;
            let adj = Math.max(adj1, adj2);
            rotCam.call(
                this,
                evt.movementY / panSpeed / this.camera.zoom,
                evt.movementX / panSpeed / this.camera.zoom / adj
            );
            panVelocities.push({
                vec: new Vector2(
                    evt.movementY / panSpeed / this.camera.zoom,
                    evt.movementX / panSpeed / this.camera.zoom / adj
                ),
                time: Date.now()
            });
        }
    });

    let inertia: NodeJS.Timeout;
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

    // Do scrolling
    let scrollOverlay = document.getElementById('scroll-overlay');
    let scrollContent = document.getElementById('scroll-content');
    let scrollMin = Math.log(0.4) / Math.log(1.003);
    let scrollMax = Math.log(40) / Math.log(1.003);
    scrollOverlay.scrollTo(0, scrollMax);
    scrollContent.style.height = scrollMax + window.innerHeight - scrollMin + 'px';
    setInterval(() => {
        this.camera.zoom = 1.003 ** (scrollMax - scrollOverlay.scrollTop);
        this.camera.updateProjectionMatrix();
    }, 10);

    // Mouse picking via raycasting
    let sphereGeom = new THREE.SphereBufferGeometry(0.01, 12, 6);
    let sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let sphere = new THREE.Mesh(sphereGeom, sphereMat);
    this.scene.add(sphere);

    window.addEventListener('mousemove', (evt) => {
        let pos = [
            2 * evt.clientX / window.innerWidth - 1,
            -(2 * evt.clientY / window.innerHeight - 1)
        ];
        let ray = new Ray();
        ray.direction.set(pos[0], pos[1], -1).unproject(this.camera).normalize();
        sphere.position.set(ray.direction.x, ray.direction.y, ray.direction.z);
    });
}

export function onRender() {
    if (doInertia) rotCam.call(this, panVelocity.x, panVelocity.y);
}
