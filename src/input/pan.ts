import { Ray, Vector2 } from 'three';

const inertiaFactor = 0.05; // Smaller number -> takes longer to stop

let panVelocities: Array<{ vel: Vector2, time: number }> = [];
let panVelocity: Vector2;
let inertia: NodeJS.Timeout;
let doInertia = false;

// Rotates camera without going past -90° or +90° latitude
function rotCam(dx: number, dy: number) {
    let newXRot = this.camera.rotation.x + dx;
    if (newXRot > -Math.PI / 2 && newXRot < Math.PI / 2) this.camera.rotation.x = newXRot;
    this.camera.rotation.y = (this.camera.rotation.y + dy) % (2 * Math.PI);
}

export function pan(x: number, y: number, dx: number, dy: number) {
    let pos = [
        2 * x / window.innerWidth - 1,
        -(2 * y / window.innerHeight - 1)
    ];
    let ray = new Ray();
    let vec = ray.direction.set(pos[0], pos[1], -1).unproject(this.camera).normalize();

    /* Without adj, moving the mouse horizontally (changing the yaw of the camera) would be too slow when zoomed in to
     * the poles (try setting adj to 1 to see what this looked like). To compensate for this, I divide by adj1. However,
     * this overcompensates when not zoomed in. To compensate it back, I use the maximum of adj1 and adj2. Don't worry
     * about the math :) */
    let adj1 = Math.sqrt(vec.x ** 2 + vec.z ** 2);
    let adj2 = (((40 - this.camera.zoom) / 39) ** 20 - 1 + 1.05) / 1.05;
    let adj = Math.max(adj1, adj2);
    rotCam.call(
        this,
        dx / this.camera.zoom,
        dy / this.camera.zoom / adj
    );
    panVelocities.push({
        vel: new Vector2(
            dx / this.camera.zoom,
            dy / this.camera.zoom / adj
        ),
        time: Date.now()
    });
}

export function start() {
    panVelocities = [];
    doInertia = false;
    clearInterval(inertia);
}

export function release() {
    // Get average speed of mouse movement
    panVelocities = panVelocities.filter(({ time: t }) => Date.now() - t < 100);
    if (panVelocities.length <= 1) return;

    // Get the total distance moved, then divide by time taken
    let panSpeed = panVelocities
        .map(({ vel }) => Math.sqrt(vel.x ** 2 + vel.y ** 2))
        .reduce((total, i) => total + i, 0) / (panVelocities[panVelocities.length - 1].time - panVelocities[0].time);

    panVelocity = panVelocities
        .slice(-3)
        .reduce((total, { vel }) => total.add(vel), new Vector2())
        .normalize()
        .multiplyScalar(panSpeed * 10);

    let velDifference = panVelocity.clone().multiplyScalar(inertiaFactor);

    doInertia = true;
    inertia = setInterval(() => {
        panVelocity.sub(velDifference);
        velDifference.multiplyScalar(0.95); // Makes slowing down a lot smoother
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
}

export function inputOnRender() {
    if (doInertia) rotCam.call(this, panVelocity.x, panVelocity.y);
}
