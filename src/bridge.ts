import { Matrix, Vec2 } from "./math.ts";
import { getMousePos } from "./common.ts"

export function main() {
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d'); 

    let j0 = new Joint(new Vec2(200, 350), SolverType.static);
    let j1 = new Joint(new Vec2(300, 350), SolverType.dynamic);
    let m = new Member(j0, j1);
    j0.draw(ctx);
    j1.draw(ctx);
    m.draw(ctx);
}

enum SolverType {
    static,
    kinematic,
    dynamic,
}

class Joint {
    pos: Vec2 = new Vec2(0.0, 0.0);
    members: Member[] = [];
    transType: SolverType = SolverType.dynamic;
    rotType: SolverType = SolverType.dynamic;

    constructor(pos: Vec2, type?: SolverType) {
        this.pos = pos;
        if (type != undefined) {
            this.transType = type;
            this.rotType = type;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const r = 10.0;
        ctx.lineWidth = 3.0;
        if (this.transType == SolverType.dynamic || this.rotType == SolverType.dynamic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 0.5*r, 0.0, 2*3.14159);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, r, 0.0, 2*3.14159);
            ctx.stroke();
        } else if (this.transType == SolverType.kinematic || this.rotType == SolverType.kinematic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, r, 0.0, 2*3.14159);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.pos.x + r, this.pos.y);
            ctx.lineTo(this.pos.x - r, this.pos.y);
            ctx.moveTo(this.pos.x, this.pos.y + r);
            ctx.lineTo(this.pos.x, this.pos.y - r);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.pos.x + 1.5*r, this.pos.y + 1.5*r);
            ctx.lineTo(this.pos.x - 1.5*r, this.pos.y + 1.5*r);
            ctx.lineTo(this.pos.x, this.pos.y);
            ctx.stroke();
        }
    }
}

class Member {
    j0: Joint;
    j1: Joint;
    size: number = 1;

    constructor(j0: Joint, j1: Joint) {
        this.j0 = j0;
        this.j1 = j1;
        j0.members.push(this);
        j1.members.push(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        const baseWidth = 5.0;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size + baseWidth;
        ctx.beginPath();
        ctx.moveTo(this.j0.pos.x, this.j0.pos.y);
        ctx.lineTo(this.j1.pos.x, this.j1.pos.y);
        ctx.stroke();
    }

    update(dt: number) {
        
    }
}