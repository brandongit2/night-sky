import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Vector2 } from 'three';

export function skyGrid() {
    let verts = [];
    let numVerts = 30;
    for (let i = 0; i <= numVerts; i++) {
        verts.push(0, 10 * Math.sin(i / numVerts * 2 * Math.PI), 10 * Math.cos(i / numVerts * 2 * Math.PI));
    }

    let geom = new LineGeometry();
    let thinMat = new LineMaterial({
        color: 0xffffff,
        linewidth: 1,
        resolution: new Vector2(window.innerWidth, window.innerHeight)
    });
    thinMat.depthTest = false;
    let thickMat = new LineMaterial({
        color: 0xffffff,
        linewidth: 3,
        resolution: new Vector2(window.innerWidth, window.innerHeight)
    });
    thickMat.depthTest = false;
    geom.setPositions(verts);

    let lines = [];
    let numLines = 18;
    for (let i = 0; i < numLines; i++) {
        lines.push(new Line2(geom, i % (numLines / 4) === 0 ? thickMat : thinMat));
        lines[i].computeLineDistances();
        lines[i].renderOrder = 1; // Render above everything else
        lines[i].rotation.set(0, i / numLines * Math.PI, 0);
    }

    return lines;
}
