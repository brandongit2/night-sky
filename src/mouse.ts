// Handles panning and zooming of camera

import { Vector2 } from 'three';

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
    window.addEventListener('mousemove', (evt) => {
        if (evt.buttons === 1) {
            rotCam.call(this, evt.movementY / panSpeed / this.camera.zoom, evt.movementX / panSpeed / this.camera.zoom);
            panVelocities.push({
                vec: new Vector2(
                    evt.movementY / panSpeed / this.camera.zoom,
                    evt.movementX / panSpeed / this.camera.zoom
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
}

export function onRender() {
    if (doInertia) rotCam.call(this, panVelocity.x, panVelocity.y);
}
