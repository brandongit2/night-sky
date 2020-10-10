import { DebugItem } from './DebugItem';

export class DebugText extends DebugItem {
    label: string;

    constructor(key: string, label: string, text: string) {
        super(key, 'p');

        this.label = label;
        this.text = text;
    }

    update(text: string) {
        this.text = text;
    }

    private set text(text: string) {
        this.domEl.innerHTML = `<b>${this.label}: </b>${text}`;
    }
}
