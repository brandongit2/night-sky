export class Inertia {
    interval: NodeJS.Timeout;

    // factor is how fast velocity hits zero. higher values mean velocity moves faster.
    constructor(factor: number) {
    }

    start(velocity: number, callback: (delta: number) => void) {
        document.getElementById('beepboop').style.background = 'red';
        this.interval = setInterval(() => {
            if (velocity > 0) {
                velocity *= 0.99;
                document.getElementById('beepboop').innerHTML = String(velocity);
                if (velocity <= 0.05) {
                    clearInterval(this.interval);
                    document.getElementById('beepboop').style.background = 'green';
                    return;
                }
                callback(velocity);
            } else {
                velocity *= 0.99;
                document.getElementById('beepboop').innerHTML = String(velocity);
                if (velocity >= -0.05) {
                    clearInterval(this.interval);
                    document.getElementById('beepboop').style.background = 'green';
                    return;
                }
                callback(velocity);
            }
        }, 10);
    }

    interrupt() {
        clearInterval(this.interval);
    }
}
