// Draws text on the screen.

import { colors } from './config.json';

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

        this.outlineText.style.color = `#${colors.sky}`;
        this.outlineText.style.webkitTextStroke = `8px #${colors.sky}`;

        document.getElementById('label-container').appendChild(this.outlineText);
        document.getElementById('label-container').appendChild(this.mainText);
    }

    _setPosAlign() {
        let a = 0;
        if (this._align === 'center') a = 50;
        if (this._align === 'right') a = 100;

        this.mainText.style.transform = `translate(calc(${this._pos[0]}px - ${a}%), calc(${this._pos[1]}px - 50%))`;
        this.outlineText.style.transform = `translate(calc(${this._pos[0]}px - ${a}%), calc(${this._pos[1]}px - 50%))`;
    }

    set pos(pos: number[]) {
        this._pos = pos;
        this._setPosAlign();
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
        this._setPosAlign();
    }
    get align() {
        return this._align;
    }
}
