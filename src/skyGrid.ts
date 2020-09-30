import { Vector2 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2'; // Lines with thickness
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

import { NightSky } from './NightSky';
import { colors } from './config.json';

let thinMat = new LineMaterial({
    color: parseInt(colors.minorGrid, 16),
    linewidth: 1,
    resolution: new Vector2(window.innerWidth, window.innerHeight)
});
thinMat.depthTest = false;
let thickMat = new LineMaterial({
    color: parseInt(colors.majorGrid, 16),
    linewidth: 2,
    resolution: new Vector2(window.innerWidth, window.innerHeight)
});
thickMat.depthTest = false;

NightSky.attachToInitialization(function () {
    let verts: number[] = [];
    let numVerts = 150; // Number of vertices in half a circle of the grid line

    /* Two sets of longitude (vertical) lines will be drawn: short ones, which go from -80° latitude to +80°, so as to
     * not clutter the poles; and long ones, which go all the way, drawn at 0°, 90°, 180°, and 270° longitude.
     */

    // Set short longitude line geometry
    for (let i = 0; i <= numVerts; i++) {
        let theta = (i * 160 / numVerts - 80) * Math.PI / 180;
        verts.push(0, Math.sin(theta), Math.cos(theta));
    }
    let shortLongGeom = new LineGeometry();
    shortLongGeom.setPositions(verts);
    verts = [];

    // Set long longitude line geometry
    for (let i = 0; i <= 180; i++) {
        let theta = (i * 180 / numVerts - 90) * Math.PI / 180;
        verts.push(0, Math.sin(theta), Math.cos(theta));
    }
    let longLongGeom = new LineGeometry();
    longLongGeom.setPositions(verts);
    verts = [];

    // Set latitude line geometry
    for (let i = 0; i <= numVerts; i++) {
        let theta = i * 2 * Math.PI / numVerts;
        verts.push(Math.cos(theta), 0, Math.sin(theta));
    }
    let latGeom = new LineGeometry();
    latGeom.setPositions(verts);

    let numLongLines = 24; // Longitude lines, must be a multiple of 4
    for (let i = 0; i < numLongLines; i++) {
        let line = i % (numLongLines / 4) === 0
            ? new Line2(longLongGeom, thickMat)
            : new Line2(shortLongGeom, thinMat);
        line.computeLineDistances();
        line.renderOrder = -1; // Render below everything else
        line.rotation.set(0, i / numLongLines * 2 * Math.PI, 0);

        this.scene.add(line);
    }

    let numLatLines = 16; // Latitude lines, must be a multiple of 2
    for (let i = -80; i <= 80; i += 160 / numLatLines) {
        let line = new Line2(latGeom, i === 0 ? thickMat : thinMat);
        line.computeLineDistances();
        line.renderOrder = -1; // Render below everything else
        line.scale.set(Math.cos(i * Math.PI / 180), 1, Math.cos(i * Math.PI / 180));
        line.position.y = Math.sin(i * Math.PI / 180);

        this.scene.add(line);
    }
});

NightSky.attachToResizeEvent(() => {
    thinMat.resolution.set(window.innerWidth, window.innerHeight);
    thickMat.resolution.set(window.innerWidth, window.innerHeight);
});
