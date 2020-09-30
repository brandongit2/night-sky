import { SphereGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three"

let starGeom = new SphereGeometry(0.1, 12);
let starMat = new MeshBasicMaterial({ color: 0xffff00 });

let stars = [[10, 0]];

export function solarSystemInit() {
    for (let star of stars) {
        let mesh = new Mesh(starGeom, starMat);
        mesh.position.x = Math.sin(star[0]);
        mesh.position.z = 1;
        this.scene.add(mesh);
    }
}
