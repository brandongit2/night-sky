// Draws labels for right ascension and declination.

import { TextLabel } from './TextLabel';
import { Vector3, Euler } from 'three';

let labels: TextLabel[] = [];
for (let theta = -80; theta <= 80; theta += 10) {
    labels.push(new TextLabel(0, 0, theta + '°', {
        fontSize: 10,
        color: theta === 0 ? 'aaa' : '777'
    }));
}

export function coordinateLabels() {
    // Declination
    let x = window.innerWidth / 2;
    for (let i = 0; i < labels.length; i++) {
        let theta = (i * 10 - 80) * Math.PI / 180;
        let vec = new Vector3(
            0,
            Math.sin(theta),
            -Math.cos(theta)
        )
        if (vec.dot(new Vector3(0, Math.sin(this.camera.rotation.x), -Math.cos(this.camera.rotation.x))) < 0) {
            labels[i].text = i * -10 + 80 + '°';
        } else {
            labels[i].text = i * 10 - 80 + '°';
        }
        vec = vec.applyEuler(new Euler(0, this.camera.rotation.y, 0)).project(this.camera);
        labels[i].pos = [x, (-vec.y + 1) * window.innerHeight / 2];
    }
}
