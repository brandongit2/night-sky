// Draws text on the screen.

interface LabelOptions {
    color?: string;
    fontSize?: number;
}

export class TextLabel {
    mainText: HTMLSpanElement;
    outlineText: HTMLSpanElement;
    _pos = [0, 0];
    _text: string;
    _color: string;
    _fontSize: number;

    constructor(x: number, y: number, text: string, options?: LabelOptions) {
        this.mainText = document.createElement('span');
        this.outlineText = document.createElement('span');

        this.pos = [x, y];
        this.text = text;
        this.color = options?.color ? options.color : 'ffffff';
        this.fontSize = options?.fontSize ? options.fontSize : 12;

        this.outlineText.style.webkitTextStroke = '8px black';

        document.getElementById('label-container').appendChild(this.outlineText);
        document.getElementById('label-container').appendChild(this.mainText);
    }

    set pos(pos: number[]) {
        this._pos = pos;
        this.mainText.style.top = pos[0] + 'px';
        this.outlineText.style.top = pos[0] + 'px';
        this.mainText.style.left = pos[1] + 'px';
        this.outlineText.style.left = pos[1] + 'px';
    }
    get pos() {
        return this._pos;
    }

    set text(text: string) {
        this._text = text;
        this.mainText.innerHTML = text;
        this.outlineText.innerHTML = text;
    }
    get text() {
        return this._text;
    }

    set color(color: string) {
        this._color = color;
        this.mainText.style.color = '#' + color;
        this.outlineText.style.color = '#' + color;
    }
    get color() {
        return this._color;
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.mainText.style.fontSize = size + 'pt';
        this.outlineText.style.fontSize = size + 'pt';
    }
    get fontSize() {
        return this._fontSize;
    }
}
