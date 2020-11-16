import { Vec2 } from "./math.ts";

export function getMousePos(canvas: HTMLCanvasElement, ev: MouseEvent) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  
    return new Vec2(
        (ev.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        (ev.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    )
}