// Draws text on the screen.

import { colors } from './config.json';

interface LabelOptions {
    color?: string;
    font?: string;
    fontSize?: number;
    hAlign?: 'left' | 'center' | 'right';
    vAlign?: 'top' | 'middle' | 'bottom';
}

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let labels: TextLabel[] = [];

export function textLabelInit() {
    canvas = <HTMLCanvasElement>document.getElementById('text-labels');
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;

    context = canvas.getContext('2d');
    context.transform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

export function textLabelOnRender() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    context.lineWidth = 6;
    context.strokeStyle = '#' + colors.sky;

    for (let label of labels) {
        context.font = `${label.fontSize}pt ${label.font}`;
        let x, y;
        switch (label.hAlign) {
            case 'left': x = 0; break;
            case 'center': x = -label.metrics.width / 2; break;
            case 'right': x = -label.metrics.width; break;
        }
        x += label.pos[0];

        switch (label.vAlign) {
            case 'top': y = label.metrics.actualBoundingBoxAscent; break;
            case 'middle': y = label.metrics.actualBoundingBoxAscent / 2; break;
            case 'bottom': y = 0; break;
        }
        y += label.pos[1];

        context.strokeText(label.text, x, y);
        context.fillStyle = '#' + label.color;
        context.fillText(label.text, x, y);
    }
}

export function textLabelOnResize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    context.transform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    for (let label of labels) {
        label.recalculateMetrics();
    }
}

export class TextLabel {
    pos = [0, 0];
    _text: string;
    color: string;
    _font: string;
    _fontSize: number;
    hAlign: 'left' | 'center' | 'right';
    vAlign: 'top' | 'middle' | 'bottom';
    metrics: TextMetrics;

    constructor(x: number, y: number, text: string, options?: LabelOptions) {
        this.pos = [x, y];
        this.text = text;
        this.color = options?.color ? options.color : 'ffffff';
        this.font = options?.font ? options.font : '\'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif';
        this.fontSize = options?.fontSize ? options.fontSize : 12;
        this.hAlign = options?.hAlign ? options.hAlign : 'center';
        this.vAlign = options?.vAlign ? options.vAlign : 'top';

        labels.push(this);
    }

    set text(text: string) {
        this._text = text;
        this.recalculateMetrics();
    }
    get text() {
        return this._text;
    }

    set font(font: string) {
        this._font = font;
        this.recalculateMetrics();
    }
    get font() {
        return this._font;
    }

    set fontSize(fontSize: number) {
        this._fontSize = fontSize;
        this.recalculateMetrics();
    }
    get fontSize() {
        return this._fontSize;
    }

    recalculateMetrics() {
        context.font = `${this.fontSize}pt ${this.font}`;
        this.metrics = context.measureText(this.text);
    }
}
