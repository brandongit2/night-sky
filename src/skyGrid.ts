import { Line } from './util/sky3d';

export function skyGrid() {
    let verts = [];
    let numVerts = 100;
    for (let i = 0; i < numVerts; i++) {
        verts.push(0, 10 * Math.sin(i / numVerts * 2 * Math.PI), 10 * Math.cos(i / numVerts * 2 * Math.PI));
    }

    // let line = new Line();
    // line.setVertices(verts);
    // let material = new MeshLineMaterial({ resolution: new THREE.Vector2(window.innerWidth, window.innerHeight), lineWidth: 0.1 });
    // return new THREE.Mesh(line, material);
}
