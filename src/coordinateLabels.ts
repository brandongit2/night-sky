// Draws labels for right ascension and declination.

import { colors } from './config.json';
import { TextLabel } from './TextLabel';

let decLabels: TextLabel[] = [];
for (let theta = -80; theta <= 80; theta += 10) {
    decLabels.push(new TextLabel(0, 0, theta + '°', {
        fontSize: 10,
        color: theta === 0 ? colors.majorGrid : colors.minorGrid
    }));
}

let raLabels: TextLabel[] = [];
for (let theta = 0; theta < 360; theta += 360 / 24) {
    raLabels.push(new TextLabel(0, 0, theta / 15 + 'h', {
        fontSize: 10,
        color: theta % 90 === 0 ? colors.majorGrid : colors.minorGrid
    }));
}

export function coordinateLabels() {
    { // Declination
        for (let i = 0; i < decLabels.length; i++) {
            let theta = (i * 10 - 80) * Math.PI / 180;
            let ang = -theta + this.camera.rotation.x;
            let pos = Math.tan(ang);
            let fac = Math.tan(this.camera.getEffectiveFOV() / 2 * Math.PI / 180);

            let onScreen = true;
            if (ang < -Math.PI / 2 || ang > Math.PI / 2) onScreen = false;
            decLabels[i].pos = [
                onScreen ? window.innerWidth / 2 : -100,
                (pos / fac / 2 + 0.5) * window.innerHeight
            ];
        }
    }

    { // Right ascension
        let vFov = this.camera.getEffectiveFOV() * Math.PI / 180;
        let fac1 = Math.cos(-vFov / 2 + this.camera.rotation.x) / Math.cos(-vFov / 2);

        let hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
        let fac2 = Math.tan(hFov / 2);
        for (let n = 0; n < raLabels.length; n++) {
            let ang = (n * 360 / 24) * Math.PI / 180 + this.camera.rotation.y;
            let pos = Math.tan(ang);
            let onScreen = true;
            if (
                (ang < -Math.PI / 2 && ang > -3 * Math.PI / 2)
                || (ang > Math.PI / 2 && ang < 3 * Math.PI / 2)
            ) onScreen = false;
            raLabels[n].pos = [
                (pos / fac2 * fac1 / 2 + 0.5) * window.innerWidth,
                onScreen ? window.innerHeight - 10 : -100
            ];
        }
    }
}
