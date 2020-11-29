import init, { Matrix, Vec2, Vector } from "./newton-2d/newton_2d.js";
import { Matrix as MatrixJS, Vector as VectorJS } from "./math.js";
import { Button, getMousePos, round } from "./common.js"

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

export async function main() {
    await init();

    let tJs = 0.0;
    let tWasm = 0.0;

    let buttons = [
        new Button('100', () => {[tJs, tWasm] = test(100);}, new Vec2(10, 10), new Vec2(150, 50)),
        new Button('1,000', () => {[tJs, tWasm] = test(1000);}, new Vec2(170, 10), new Vec2(150, 50)),
        new Button('2,000', () => {[tJs, tWasm] = test(2000);}, new Vec2(330, 10), new Vec2(150, 50)),
        new Button('5,000', () => {[tJs, tWasm] = test(5000);}, new Vec2(490, 10), new Vec2(150, 50)),
        new Button('10,000', () => {[tJs, tWasm] = test(10000);}, new Vec2(650, 10), new Vec2(150, 50))
    ];

    canvas.addEventListener('click', ev => {
        let mpos = getMousePos(canvas, ev);
        buttons.forEach(b => b.click(mpos));
        
        draw(ctx, tJs, tWasm);
        buttons.forEach(b => b.draw(ctx));
    });

    draw(ctx, tJs, tWasm);
    buttons.forEach(b => b.draw(ctx));
}

function draw(ctx: CanvasRenderingContext2D, tJs: number, tWasm: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '36px JetBrains Mono';
    ctx.textAlign = 'start';
    ctx.fillText('Javascript:',200, 150);
    ctx.fillText(round(tJs / 1000, 4).toString() + 's', 200, 200);

    ctx.fillText('Web Assembly:', 550, 150);
    ctx.fillText(round(tWasm / 1000, 4).toString() + 's', 550, 200);

    let diff = ((tWasm - tJs) / tJs) * 100;
    ctx.fillText(round(diff, 2).toString() + '%', 400, 300);
}

function test(n: number) {
    let mData = randomMatrixData(n);
    let vData = randomVectorData(n);

    let jsMat = MatrixJS.from(n, n, mData);
    let jsVec = VectorJS.from(vData);
    let wasmMat = Matrix.from(n, n, mData);
    let wasmVec = Vector.from(vData);

    let t0 = performance.now();
    jsMat.solve(jsVec);
    let tJs = performance.now() - t0;

    t0 = performance.now();
    wasmMat.solve_mut(wasmVec);
    let tWasm = performance.now() - t0;

    return [tJs, tWasm];
}

function randomMatrixData(n: number) {
    let data = new Float64Array(n * n);
    for (let i=0; i < n; i++) {
        for (let j=0; j < n; j++) {
            let idx = i * n + j;
            if (j == i) {
                data[idx] = 10;
            } else {
                data[idx] = Math.random() * 9.9;
            }
        }
    }
    return data;
}

function randomVectorData(n: number) {
    let data = new Float64Array(n);
    for (let i=0; i < n; i++) {
        data[i] = Math.random() * 10;
    }
    return data;
}