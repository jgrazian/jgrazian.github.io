import { Vec2 } from "./newton-2d/newton_2d.js";
export function getMousePos(canvas, ev) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    return new Vec2((ev.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
    (ev.clientY - rect.top) * scaleY // been adjusted to be relative to element
    );
}
export function round(num, decimalPlaces = 0) {
    var p = Math.pow(10, decimalPlaces);
    var m = (num * p) * (1 + Number.EPSILON);
    return Math.round(m) / p;
}
export function roundToNearest(numToRound, numToRoundTo) {
    numToRoundTo = 1 / (numToRoundTo);
    return Math.round(numToRound * numToRoundTo) / numToRoundTo;
}
// Interpolates hex colors
// Enter a and b as hex number 0xffffff
// https://gist.github.com/nikolas/b0cce2261f1382159b507dd492e1ceef
export function lerpColor(a, b, amount) {
    const ar = a >> 16, ag = a >> 8 & 0xff, ab = a & 0xff, br = b >> 16, bg = b >> 8 & 0xff, bb = b & 0xff, rr = ar + amount * (br - ar), rg = ag + amount * (bg - ag), rb = ab + amount * (bb - ab);
    return '#' + ((rr << 16) + (rg << 8) + (rb | 0)).toString(16).padStart(6, '0');
}
;
export class Button {
    constructor(content, callback, corner, bounds) {
        this.bounds = new Vec2(1.0, 1.0);
        this.corner = new Vec2(0.0, 0.0);
        this.content = content;
        this.callback = callback;
        if (corner != undefined) {
            this.corner = corner;
        }
        if (bounds != undefined) {
            this.bounds = bounds;
        }
    }
    click(point) {
        if (point.x > this.corner.x &&
            point.x < (this.corner.x + this.bounds.x) &&
            point.y > this.corner.y &&
            point.y < (this.corner.y + this.bounds.y)) {
            this.callback();
            return true;
        }
        else {
            return false;
        }
    }
    draw(ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.0;
        let center = this.corner.add(this.bounds.mul(0.5));
        ctx.translate(center.x, center.y);
        if (typeof this.content == 'string') {
            ctx.font = '24px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.content, 0.0, 0.0);
        }
        else {
            ctx.stroke(this.content);
        }
        ctx.translate(-center.x, -center.y);
        ctx.strokeRect(this.corner.x, this.corner.y, this.bounds.x, this.bounds.y);
    }
}
export function canvasButton(path, callback) {
}
