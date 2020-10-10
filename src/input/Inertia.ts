import { NightSky } from "../NightSky";

export class Inertia {
    interval: NodeJS.Timeout;

    start(velocity: number, callback: (delta: number) => void) {
        let startTime = Date.now();
        let direction = velocity > 0;
        this.interval = setInterval(() => {
            let easing = Math.exp((-Date.now() + startTime) / 1000);
            velocity *= easing;

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
