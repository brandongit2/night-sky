let i = 0; // Used to identify different logs.

export class DebugItem {
    static keys: { [key: string]: number } = {}; // Logs will be ordered alphabetically via these keys.
    static keyOrder: string[] = [];

    domEl: HTMLElement;

    constructor(key: string, elType: string) {
        this.domEl = document.createElement(elType);
        this.domEl.setAttribute('id', `debug-${i}`);
        DebugItem.keys[key] = i;
        i++;

        // Insert key into keyOrder alphabetically
        let loc;
        let elementAdded = false;
        for (let [x, log] of DebugItem.keyOrder.entries()) {
            if (key.localeCompare(log) === -1) {
                DebugItem.keyOrder.splice(x, 0, key);
                loc = x;
                elementAdded = true;
                break;
            }
        }
        if (!elementAdded) {
            DebugItem.keyOrder.push(key);
            loc = DebugItem.keyOrder.length - 1;
        }

        if (!(loc === DebugItem.keyOrder.length - 1)) {
            document.getElementById('debug').insertBefore(this.domEl, document.getElementById(`debug-${DebugItem.keys[DebugItem.keyOrder[loc + 1]]}`));
        } else {
            document.getElementById('debug').appendChild(this.domEl);
        }
    }
}
