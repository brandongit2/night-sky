import { DebugText } from "../debug/DebugText";
import { NightSky } from "../NightSky";

let easingLog: DebugText;
let velocityLog: DebugText;

export class Inertia {
    interval: NodeJS.Timeout;

    // factor is how fast velocity hits zero. higher values mean velocity moves faster.
    constructor(factor: number) {
    }

    start(velocity: number, callback: (delta: number) => void) {
        let startTime = Date.now();
        let direction = velocity > 0;
        this.interval = setInterval(() => {
            let easing = Math.exp((-Date.now() + startTime) / 10000);
            easingLog.update(String(easing));
            velocityLog.update(String(velocity));
            // velocity *= easing;

            if (direction) {
                if (velocity <= 0.01) {
                    clearInterval(this.interval);
                    return;
                }
            } else {
                if (velocity >= -0.01) {
                    clearInterval(this.interval);
                    return;
                }
            }

            callback(velocity);
        }, 10);
    }

    interrupt() {
        clearInterval(this.interval);
    }
}

NightSky.attachToInitialization(() => {
    easingLog = new DebugText('d', 'easing', '0');
    velocityLog = new DebugText('c', 'velocity', '0');
})
