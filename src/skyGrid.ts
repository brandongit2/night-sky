import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Vector2 } from 'three';

export function skyGrid() {
    let verts: number[] = [];
    let numVerts = 100; // Number of vertices in half a circle of the grid line

    /* Two sets of longitude (vertical) lines will be drawn: short ones, which go from -80° latitude to +80°, so as to
     * not clutter the poles; and long ones, which go all the way, drawn at 0°, 90°, 180°, and 270° longitude.
     */

    // Set short longitude line geometry
    for (let i = -80; i <= 80 + 0.001; i += 160 / numVerts) { // +0.001 to account for floating point error
        verts.push(0, Math.sin(i * Math.PI / 180), Math.cos(i * Math.PI / 180));
    }
    let shortLongGeom = new LineGeometry();
    shortLongGeom.setPositions(verts);
    verts = [];

    // Set long longitude line geometry
    for (let i = -90; i <= 90; i += 180 / numVerts) {
        verts.push(0, Math.sin(i * Math.PI / 180), Math.cos(i * Math.PI / 180));
    }
    let longLongGeom = new LineGeometry();
    longLongGeom.setPositions(verts);
    verts = [];

    // Set latitude line geometry
    for (let i = 0; i <= 2 * Math.PI + 0.001; i += 2 * Math.PI / numVerts) { // +0.001 to account for floating point error
        verts.push(Math.cos(i), 0, Math.sin(i));
    }
    let latGeom = new LineGeometry();
    latGeom.setPositions(verts);

    let thinMat = new LineMaterial({
        color: 0x777777,
        linewidth: 1,
        resolution: new Vector2(window.innerWidth, window.innerHeight)
    });
    thinMat.depthTest = false;
    let thickMat = new LineMaterial({
        color: 0xaaaaaa,
        linewidth: 2,
        resolution: new Vector2(window.innerWidth, window.innerHeight)
    });
    thickMat.depthTest = false;

    let lines = [];
    let numLongLines = 24; // Longitude lines, must be a multiple of 4
    for (let i = 0; i < numLongLines; i++) {
        lines.push(
            i % (numLongLines / 4) === 0
                ? new Line2(longLongGeom, thickMat)
                : new Line2(shortLongGeom, thinMat)
        );
        lines[i].computeLineDistances();
        lines[i].renderOrder = -1; // Render below everything else
        lines[i].rotation.set(0, i / numLongLines * 2 * Math.PI, 0);
    }

    let numLatLines = 16; // Latitude lines, must be a multiple of 2
    for (let i = -80; i <= 80; i += 160 / numLatLines) {
        lines.push(new Line2(latGeom, i === 0 ? thickMat : thinMat));
        lines[lines.length - 1].computeLineDistances();
        lines[lines.length - 1].renderOrder = -1; //Render below everything else
        lines[lines.length - 1].scale.set(Math.cos(i * Math.PI / 180), 1, Math.cos(i * Math.PI / 180));
        lines[lines.length - 1].position.y = Math.sin(i * Math.PI / 180);
    }

    return lines;
}
