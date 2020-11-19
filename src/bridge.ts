import { Matrix, Vec2, Vector } from "./math.ts";
import { getMousePos } from "./common.ts"

const g = 9.81;

export function main() {
    const canvas = <HTMLCanvasElement> document.getElementById('canvas');
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');

    let joints = [
        new Node(new Vec2(-5, 0), SolverType.static),
        new Node(new Vec2(0, -8.66), SolverType.dynamic),
        new Node(new Vec2(5, 0), SolverType.static),
    ];
    joints[1].force = new Vec2(0, -1732);

    let members = [
        new Element(joints[0], joints[1]),
        new Element(joints[1], joints[2]),
    ]

    joints.forEach(j => j.draw(ctx));
    members.forEach(m => m.draw(ctx));
    let t = new Truss(joints, members);
    console.log(t.globalStiffnessMatrix().toString());
    console.log(t.forceVector().toString());
    console.log(t.solve().toString());
}

enum SolverType {
    static,
    kinematic,
    dynamic,
}

class Node {
    pos: Vec2 = new Vec2(0.0, 0.0);
    type: SolverType = SolverType.dynamic;
    force: Vec2 = new Vec2(0.0, 0.0);

    constructor(pos: Vec2, type?: SolverType) {
        this.pos = pos;
        if (type != undefined) {
            this.type = type;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const r = 10.0;
        ctx.lineWidth = 3.0;
        if (this.type == SolverType.dynamic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 0.5*r, 0.0, 2*3.14159);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, r, 0.0, 2*3.14159);
            ctx.stroke();
        } else if (this.type == SolverType.kinematic) {
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

class Element {
    i: Node;
    j: Node;
    size: number = 1;

    constructor(i: Node, j: Node) {
        this.i = i;
        this.j = j;
    }

    length() {
        return (this.j.pos.sub(this.i.pos)).len();
    }

    angle() {
        return (this.j.pos.sub(this.i.pos)).angle();
    }

    draw(ctx: CanvasRenderingContext2D) {
        const baseWidth = 5.0;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size + baseWidth;
        ctx.beginPath();
        ctx.moveTo(this.i.pos.x, this.i.pos.y);
        ctx.lineTo(this.j.pos.x, this.j.pos.y);
        ctx.stroke();
    }

    localStiffnessMatrix(): Matrix {
        const E = 10*1000;
        const A = 0.1;//this.size * this.size;
        const L = this.length();
        const AEL = (A*E)/L;

        const theta = this.angle();
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        let m = new Matrix(4, 4);

        m.set(0, 0, AEL*c*c);
        m.set(0, 1, AEL*c*s);
        m.set(0, 2, -AEL*c*c);
        m.set(0, 3, -AEL*c*s);

        m.set(1, 0, AEL*c*s);
        m.set(1, 1, AEL*s*s);
        m.set(1, 2, -AEL*c*s);
        m.set(1, 3, -AEL*s*s);

        m.set(2, 0, -AEL*c*c);
        m.set(2, 1, -AEL*c*s);
        m.set(2, 2, AEL*c*c);
        m.set(2, 3, AEL*c*s);

        m.set(3, 0, -AEL*c*s);
        m.set(3, 1, -AEL*s*s);
        m.set(3, 2, AEL*c*s);
        m.set(3, 3, AEL*s*s);

        return m;
    }
}

class Truss {
    nodes: Node[];
    elements: Element[];

    constructor(nodes?: Node[], elements?: Element[]) {
        this.nodes = (nodes != undefined) ? nodes : [];
        this.elements = (elements != undefined) ? elements : [];
    }

    solve(): Vector {
        let m = this.globalStiffnessMatrix();
        let f = this.forceVector();

        return m.solve(f);
    }

    forceVector(): Vector {
        let f = new Vector(this.nodes.length * 2);

        for (let i=0; i < this.nodes.length; i++) {
            let ind = i*2;
            f.set(ind + 0, this.nodes[i].force.x);
            f.set(ind + 1, this.nodes[i].force.y);
        }
        return f;
    }

    globalStiffnessMatrix(): Matrix {
        let m = new Matrix(this.nodes.length * 2, this.nodes.length * 2);

        for (let element of this.elements) {
            const lm = element.localStiffnessMatrix();
            // Index of element's nodes
            const ni0 = this.nodes.indexOf(element.i);
            const ni1 = this.nodes.indexOf(element.j);
            // Actual index in matrix
            const mi0 = ni0 * 2;
            const mi1 = ni1 * 2;

            m.set(mi0 + 0, mi0 + 0, m.get(mi0 + 0, mi0 + 0) + lm.get(0, 0));
            m.set(mi0 + 0, mi0 + 1, m.get(mi0 + 0, mi0 + 1) + lm.get(0, 1));
            m.set(mi0 + 1, mi0 + 0, m.get(mi0 + 1, mi0 + 0) + lm.get(1, 0));
            m.set(mi0 + 1, mi0 + 1, m.get(mi0 + 1, mi0 + 1) + lm.get(1, 1));

            m.set(mi1 + 0, mi0 + 0, m.get(mi1 + 0, mi0 + 0) + lm.get(2, 0));
            m.set(mi1 + 0, mi0 + 1, m.get(mi1 + 0, mi0 + 1) + lm.get(2, 1));
            m.set(mi1 + 1, mi0 + 0, m.get(mi1 + 1, mi0 + 0) + lm.get(3, 0));
            m.set(mi1 + 1, mi0 + 1, m.get(mi1 + 1, mi0 + 1) + lm.get(3, 1));

            m.set(mi0 + 0, mi1 + 0, m.get(mi0 + 0, mi1 + 0) + lm.get(0, 2));
            m.set(mi0 + 0, mi1 + 1, m.get(mi0 + 0, mi1 + 1) + lm.get(0, 3));
            m.set(mi0 + 1, mi1 + 0, m.get(mi0 + 1, mi1 + 0) + lm.get(1, 2));
            m.set(mi0 + 1, mi1 + 1, m.get(mi0 + 1, mi1 + 1) + lm.get(1, 3));

            m.set(mi1 + 0, mi1 + 0, m.get(mi1 + 0, mi1 + 0) + lm.get(2, 2));
            m.set(mi1 + 0, mi1 + 1, m.get(mi1 + 0, mi1 + 1) + lm.get(2, 3));
            m.set(mi1 + 1, mi1 + 0, m.get(mi1 + 1, mi1 + 0) + lm.get(3, 2));
            m.set(mi1 + 1, mi1 + 1, m.get(mi1 + 1, mi1 + 1) + lm.get(3, 3));
        }

        return m;
    }
}