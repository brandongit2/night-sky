// Draws labels for right ascension and declination.

import { colors } from './config.json';
import { TextLabel } from './TextLabel';

let decLabels: TextLabel[] = [];
for (let theta = -80; theta <= 80; theta += 10) {
    let text = theta + '°';
    if (theta === 0) text = '';
    decLabels.push(new TextLabel(0, 0, text, {
        fontSize: 10,
        color: colors.minorGrid
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
        let hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);

        for (let n = 0; n < raLabels.length; n++) {
            let ang = (n * 360 / 24) * Math.PI / 180 + this.camera.rotation.y;
            let x = Math.tan(ang);
            let y;

            if (vFov / 2 - this.camera.rotation.x < 0) { // Render at bottom of screen
                x *= Math.cos(vFov / 2 - this.camera.rotation.x) / Math.cos(vFov / 2);
                x /= Math.tan(hFov / 2);
                y = window.innerHeight - 10;
            } else if (-vFov / 2 - this.camera.rotation.x > 0) { // Render at top of screen
                x *= Math.cos(vFov / 2 + this.camera.rotation.x) / Math.cos(vFov / 2);
                x /= Math.tan(hFov / 2);
                y = 10;
            } else { // Render at equator
                x /= Math.cos(this.camera.rotation.x);
                x /= Math.tan(hFov / 2);
                y = (Math.tan(this.camera.rotation.x) / Math.tan(vFov / 2) / 2 + 0.5) * window.innerHeight;

                if (y < 10) y = 10;
                if (y > window.innerHeight - 10) y = window.innerHeight - 10;
            }

            let onScreen = true;
            if (
                (ang < -Math.PI / 2 && ang > -3 * Math.PI / 2)
                || (ang > Math.PI / 2 && ang < 3 * Math.PI / 2)
            ) onScreen = false;

            raLabels[n].pos = [
                (x / 2 + 0.5) * window.innerWidth,
                onScreen ? y : -100
            ];
        }
    }
}
