import { SphereGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';

import { NightSky } from './NightSky';

let starGeom = new SphereGeometry(0.1, 12);
let starMat = new MeshBasicMaterial({ color: 0xffff00 });

let stars = [[10, 0]];

NightSky.attachToInitialization(function () {
    for (let star of stars) {
        let mesh = new Mesh(starGeom, starMat);
        mesh.position.x = Math.sin(star[0]);
        mesh.position.z = 1;
        this.scene.add(mesh);
    }
});
