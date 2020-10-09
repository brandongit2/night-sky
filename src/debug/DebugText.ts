import { DebugItem } from './DebugItem';

export class DebugText extends DebugItem {
    constructor(name: string, text: string) {
        super(name, 'p');

        this.text = text;
    }

    update(text: string) {
        this.text = text;
    }

    private set text(text: string) {
        this.domEl.innerHTML = `<b>${this.name}: </b>${text}`;
    }
}
