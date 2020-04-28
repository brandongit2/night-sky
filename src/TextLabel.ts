// Draws text on the screen.

interface LabelOptions {
    color?: string;
    fontSize?: number;
    align?: 'left' | 'center' | 'right';
}

export class TextLabel {
    mainText: HTMLSpanElement;
    outlineText: HTMLSpanElement;
    _pos = [0, 0];
    _text: string;
    _color: string;
    _fontSize: number;
    _align: 'left' | 'center' | 'right';

    constructor(x: number, y: number, text: string, options?: LabelOptions) {
        this.mainText = document.createElement('span');
        this.outlineText = document.createElement('span');

        this.pos = [x, y];
        this.text = text;
        this.color = options?.color ? options.color : 'ffffff';
        this.fontSize = options?.fontSize ? options.fontSize : 12;
        this.align = options?.align ? options.align : 'center';

        this.outlineText.style.webkitTextStroke = '8px black';

        document.getElementById('label-container').appendChild(this.outlineText);
        document.getElementById('label-container').appendChild(this.mainText);
    }

    set pos(pos: number[]) {
        this._pos = pos;
        this.mainText.style.left = pos[0] + 'px';
        this.outlineText.style.left = pos[0] + 'px';
        this.mainText.style.top = pos[1] + 'px';
        this.outlineText.style.top = pos[1] + 'px';
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

    set align(align: 'left' | 'center' | 'right') {
        this._align = align;
        let a;
        switch (align) {
            case 'left':
                a = 'translate(0px, -50%)';
                break;
            case 'center':
                a = 'translate(-50%, -50%)';
                break;
            case 'right':
                a = 'translate(-100%, -50%)';
                break;
        }
        this.mainText.style.transform = a;
        this.outlineText.style.transform = a;
    }
    get align() {
        return this._align;
    }
}
