import { Vec2 } from "./newton-2d/newton_2d.js";

export function getMousePos(canvas: HTMLCanvasElement, ev: MouseEvent): Vec2 {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return new Vec2(
        (ev.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        (ev.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    )
}

// Interpolates hex colors
// Enter a and b as hex number 0xffffff
// https://gist.github.com/nikolas/b0cce2261f1382159b507dd492e1ceef
export function lerpColor(a: number, b: number, amount: number): string {
    const ar = a >> 16,
        ag = a >> 8 & 0xff,
        ab = a & 0xff,

        br = b >> 16,
        bg = b >> 8 & 0xff,
        bb = b & 0xff,

        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((rr << 16) + (rg << 8) + (rb | 0)).toString(16).padStart(6, '0');
};

export class Button {
    content: Path2D | string;
    bounds: Vec2 = new Vec2(1.0, 1.0);
    corner: Vec2 = new Vec2(0.0, 0.0);
    callback: Function;

    constructor(content: Path2D | string, callback: Function, corner?: Vec2, bounds?: Vec2) {
        this.content = content;
        this.callback = callback;
        if (corner != undefined) {
            this.corner = corner;
        }
        if (bounds != undefined) {
            this.bounds = bounds;
        }
    }

    click(point: Vec2): boolean {
        if (point.x > this.corner.x &&
            point.x < (this.corner.x + this.bounds.x) &&
            point.y > this.corner.y &&
            point.y < (this.corner.y + this.bounds.y)
        ) {
            this.callback();
            return true;
        } else {
            return false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.0;
        let center = this.corner.add(this.bounds.mul(0.5));
        ctx.translate(center.x, center.y);
        if (typeof this.content == 'string') {
            ctx.font = '24px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.content, 0.0, 0.0);
        } else {
            ctx.stroke(this.content);
        }
        ctx.translate(-center.x, -center.y);
        ctx.strokeRect(this.corner.x, this.corner.y, this.bounds.x, this.bounds.y);
    }
}

export function canvasButton(path: Path2D, callback: Function) {

}