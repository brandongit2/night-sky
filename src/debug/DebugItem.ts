export class DebugItem {
    name: string;
    domEl: HTMLElement;
    logs: string[] = [];

    constructor(name: string, elType: string) {
        if (this.logs.hasOwnProperty(name)) {
            throw new Error(`A debug element already exists with name "${name}".`);
        } else {
            this.logs.push(name);
        }

        this.name = name;
        this.domEl = document.createElement(elType);
        this.domEl.setAttribute('id', `debug-${name}`);

        document.getElementById('debug').appendChild(this.domEl);
    }
}
