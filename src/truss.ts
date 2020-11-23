import init, { Matrix, Vec2, Vector } from "./newton-2d/newton_2d.js";
import { Button, getMousePos, lerpColor } from "./common.js"

// Force in N
// E in GPa
let solved = false;

export async function main() {
    await init();

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    let [joints, members] = demoTruss();
    let truss = new Truss(joints, members);

    function solve() {
        console.log('Global Stiffness Matrix:\n' + truss.globalStiffnessMatrix().to_string());
        console.log('Global Forcing Vector:\n' + truss.forceVector().to_string());
        let sol = truss.solve();
        truss.applySolution(sol[0], sol[1]);
        console.log('Resulting forces:\n' + sol[0].to_string());
        console.log('Resulting displacements: \n' + sol[1].to_string());
        solved = true;
    }

    let buttons = [
        new Button(jointFixed(15), () => truss.nodes.push(new Node(new Vec2(35, 70), JointType.Fixed)), new Vec2(10, 10), new Vec2(50, 50)),
        new Button(jointRoller(15), () => truss.nodes.push(new Node(new Vec2(95, 70), JointType.Roller)), new Vec2(70, 10), new Vec2(50, 50)),
        new Button(jointFree(15), () => truss.nodes.push(new Node(new Vec2(155, 70))), new Vec2(130, 10), new Vec2(50, 50)),
        new Button('Trash', () => truss.deleteSelected(), new Vec2(10, 480), new Vec2(80, 50)),
        new Button('Solve', () => (!solved) ? solve() : solved = false, new Vec2(870, 10), new Vec2(80, 50))
    ];

    canvas.addEventListener('click', ev => {
        let mpos = getMousePos(canvas, ev);
        buttons.forEach(b => b.click(mpos));
        truss.click(mpos);
    });
    canvas.addEventListener('dblclick', ev => {
        let mpos = getMousePos(canvas, ev);
        truss.dblclick(mpos);
    });
    canvas.addEventListener('mousedown', ev => {
        let mpos = getMousePos(canvas, ev);
        truss.mousedown(mpos);
    });
    canvas.addEventListener('mouseup', ev => {
        truss.mouseup();
    });
    canvas.addEventListener('mousemove', ev => {
        let mpos = getMousePos(canvas, ev);
        truss.mousemove(mpos);
    });
    canvas.addEventListener('wheel', ev => truss.wheel(ev));


    function step(dt: number) {
        ctx.clearRect(0, 0, 1000, 1000);
        buttons.forEach(b => b.draw(ctx));
        truss.draw(ctx);
        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}

enum JointType {
    Fixed,
    Roller,
    Free,
}


class Node {
    _pos: Vec2 = new Vec2(0.0, 0.0);
    _deform: Vec2 = new Vec2(0.0, 0.0);

    _fApplied: Vec2 = new Vec2(0.0, 0.0);
    _fReaction: Vec2 = new Vec2(0.0, 0.0);

    type: JointType = JointType.Free;
    orientation: number = 0; // Rotation in deg

    _scale: number = 20.0
    selected: boolean = false;
    drag: boolean = false;
    forcing: boolean = false;

    constructor(pos: Vec2, type?: JointType) {
        this._pos = pos;
        if (type != undefined) {
            this.type = type;
        }
    }

    get pos(): Vec2 {
        const deformScale = 2000;
        if (solved) {
            return this._pos.add(this._deform.mul(deformScale));
        } else {
            return this._pos;
        }
    }

    get force(): Vec2 {
        if (solved) {
            return this._fApplied.add(this._fReaction);
        } else {
            return this._fApplied;
        }
    }

    set force(force: Vec2) {
        this._fApplied = force;
    }

    hit(point: Vec2): boolean {
        if (this.pos.sub(point).len_sq() <= this._scale * this._scale) {
            return true;
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = (this.selected || this.drag) ? '#ffa538' : 'black';
        ctx.strokeStyle = (this.forcing) ? 'red' : ctx.strokeStyle;
        ctx.lineWidth = 1.0;
        if (this.type == JointType.Free) {
            ctx.translate(this.pos.x, this.pos.y);
            ctx.stroke(jointFree(this._scale));
            ctx.translate(-this.pos.x, -this.pos.y);
        } else if (this.type == JointType.Roller) {
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.orientation * Math.PI / 180);
            ctx.stroke(jointRoller(this._scale));
            ctx.rotate(-this.orientation * Math.PI / 180);
            ctx.translate(-this.pos.x, -this.pos.y);
        } else if (this.type == JointType.Fixed) {
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.orientation * Math.PI / 180);
            ctx.stroke(jointFixed(this._scale));
            ctx.rotate(-this.orientation * Math.PI / 180);
            ctx.translate(-this.pos.x, -this.pos.y);
        }

        if (this.force.len_sq() > 0.01) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
            let force = this.force.normalize().mul(this.force.len() / 10_000);
            ctx.lineTo(this.pos.x + force.x, this.pos.y + force.y);
            ctx.stroke();
        }
    }
}

class Element {
    i: Node;
    j: Node;
    size: number = 1;

    E: number = 31.4 * Math.pow(10, 9); // E of steel, GPa
    sigmaY: number = 250 * Math.pow(10, 6); // Yeild strength of steel, MPa
    sigma: number = 0; // Stress in element

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
        ctx.strokeStyle = 'black';
        const baseWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size + baseWidth;
        if (solved) {
            let percent = this.sigma / this.sigmaY;
            if (percent > 1.0) {
                percent = 1.0;
            }
            ctx.strokeStyle = lerpColor(0x0000ff, 0xff0000, percent);
        }

        ctx.beginPath();
        ctx.moveTo(this.i.pos.x, this.i.pos.y);
        ctx.lineTo(this.j.pos.x, this.j.pos.y);
        ctx.stroke();
    }

    localStiffnessMatrix(): Matrix {
        const E = this.E;
        const A = this.size * this.size;
        const L = this.length();
        const AEL = (A * E) / L;

        const theta = this.angle();
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        let data = new Float64Array([
            AEL * c * c, AEL * c * s, -AEL * c * c, -AEL * c * s,
            AEL * c * s, AEL * s * s, -AEL * c * s, -AEL * s * s,
            -AEL * c * c, -AEL * c * s, AEL * c * c, AEL * c * s,
            -AEL * c * s, -AEL * s * s, AEL * c * s, AEL * s * s
        ]);
        return Matrix.from(4, 4, data);
    }
}

class Truss {
    nodes: Node[];
    elements: Element[];

    constructor(nodes?: Node[], elements?: Element[]) {
        this.nodes = (nodes != undefined) ? nodes : [];
        this.elements = (elements != undefined) ? elements : [];
    }

    // http://web.mit.edu/course/3/3.11/www/modules/fea.pdf
    solve(): [Vector, Vector] {
        let m = this.globalStiffnessMatrix();
        let f = this.forceVector();
        let u = new Vector(f.n);

        let freeNodes = [];
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type == JointType.Free) {
                freeNodes.push(i * 2 + 0);
                freeNodes.push(i * 2 + 1);
            } else if (this.nodes[i].type == JointType.Roller) {
                if ((this.nodes[i].orientation / 90) % 2 == 0) {
                    // Horizontal -> Move in x
                    freeNodes.push(i * 2 + 0);
                } else {
                    // Vertical -> Move in y
                    freeNodes.push(i * 2 + 1);
                }
            }
        }

        // Solve for displacements
        let f_reduced = Vector.from(new Float64Array(freeNodes.map(n => f.get(n))));
        let m_reduced = m.get_rows_columns(new Uint32Array(freeNodes), new Uint32Array(freeNodes));
        let u_reduced = m_reduced.solve_mut(f_reduced);
        if (u_reduced.get(0) > Math.pow(10, 3)) {
            console.warn("This problem may be inadequetly constrained.");
        }

        // Solve for forces
        // Sub u_reduced back into the full u
        for (let i = 0; i < u_reduced.n; i++) {
            u.set(freeNodes[i], u_reduced.get(i));
        }
        f = m.mul_vec(u);

        return [f, u];
    }

    applySolution(f: Vector, u: Vector) {
        // Apply deformation and reaction forces to joints
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i]._deform = new Vec2(u.get(i * 2 + 0), u.get(i * 2 + 1));
            this.nodes[i]._fReaction = new Vec2(f.get(i * 2 + 0), f.get(i * 2 + 1));
        }
        // Calc stress in elements
        for (let element of this.elements) {
            element.sigma = element.E * Math.sqrt(Math.pow(element.i._deform.x - element.j._deform.x, 2) + Math.pow(element.i._deform.y - element.j._deform.y, 2));
        }
    }

    forceVector(): Vector {
        let f = new Vector(this.nodes.length * 2);

        for (let i = 0; i < this.nodes.length; i++) {
            let idx = i * 2;
            f.set(idx + 0, this.nodes[i].force.x);
            f.set(idx + 1, this.nodes[i].force.y);
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

    click(point: Vec2) {
        let prevSelection: Node = null;
        let selected: Node = null;
        for (let node of this.nodes) {
            // Node was already selected
            if (node.selected) {
                prevSelection = node;
            }
            // Currently applying force to node (dblclick)
            if (node.forcing) {
                if (node.hit(point)) {
                    node._fApplied = new Vec2(0, 0);
                    node.forcing = false;
                    return;
                }
                let force = point.sub(node.pos).mul(1000);
                node._fApplied = force;
                node.forcing = false;
                return;
            }
            if (node.hit(point)) {
                selected = node;
                node.selected = true;
            }
        }
        // Did not click on node -> Clear selections
        if (!selected) {
            if (prevSelection) {
                prevSelection.selected = false;
            }
            return;
        }

        if (!prevSelection) {
            return;
        }
        // Clicked on self -> Uncheck
        if (prevSelection == selected) {
            prevSelection.selected = false;
            return;
        }
        // Clicked on a diffrent node -> toggle connection
        selected.selected = false;
        let toRemove = this.elements.findIndex(e => (e.i == prevSelection && e.j == selected) || (e.i == selected && e.j == prevSelection));
        if (toRemove != -1) {
            this.elements.splice(toRemove, 1);
        } else {
            this.elements.push(new Element(prevSelection, selected));
        }
    }

    dblclick(point: Vec2) {
        for (let node of this.nodes) {
            if (node.hit(point)) {
                node.forcing = true;
            }
        }
    }

    mousedown(point: Vec2) {
        for (let node of this.nodes) {
            if (node.drag) {
                node.drag = false;
            }
            if (node.hit(point)) {
                node.drag = true;
            }
        }
    }

    mouseup() {
        for (let node of this.nodes) {
            node.drag = false;
        }
    }

    mousemove(point: Vec2) {
        for (let node of this.nodes) {
            if (node.drag) {
                node._pos = point;
            }
        }
    }

    wheel(ev: WheelEvent) {
        ev.preventDefault();

        let selected: Node = null;
        for (let node of this.nodes) {
            if (node.selected) {
                selected = node;
            }
        }
        if (!selected) return;

        if (ev.deltaY > 0) {
            selected.orientation += 90;
        } else {
            selected.orientation -= 90;
        }
    }

    deleteSelected() {
        for (let node of this.nodes) {
            if (node.selected) {
                // Check in reverse order to not change array indexes
                for (let i = this.elements.length - 1; i >= 0; i--) {
                    if (this.elements[i].i == node || this.elements[i].j == node) {
                        this.elements.splice(i, 1)
                    }
                }
                this.nodes.splice(this.nodes.indexOf(node), 1);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (let element of this.elements) {
            element.draw(ctx);
        }
        for (let node of this.nodes) {
            node.draw(ctx);
        }
    }
}

function jointFixed(scale: number): Path2D {
    let path = new Path2D();
    path.moveTo(0.0, 0.0);
    path.lineTo(1.0 * scale, 1.0 * scale);
    path.lineTo(-1.0 * scale, 1.0 * scale);
    path.lineTo(0.0, 0.0);

    path.moveTo(-1.5 * scale, 1.0 * scale);
    path.lineTo(1.5 * scale, 1.0 * scale);

    for (let i = 0; i < 5; i++) {
        let offset = i * 0.5 * scale;
        path.moveTo(offset + -1.0 * scale, 1.0 * scale);
        path.lineTo(offset + -1.5 * scale, 1.5 * scale);
    }

    return path;
}

function jointRoller(scale: number): Path2D {
    let path = new Path2D();
    path.moveTo(0.0, 0.0);
    path.lineTo(1.0 * scale, 0.5 * scale);
    path.lineTo(-1.0 * scale, 0.5 * scale);
    path.lineTo(0.0, 0.0);

    for (let i = 0; i < 3; i++) {
        let offset = i * 1 * scale;
        path.moveTo(offset + -1.0 * scale + 0.25 * scale, 0.75 * scale);
        path.arc(offset + -1.0 * scale, 0.75 * scale, 0.22 * scale, 0, 2 * Math.PI);
    }

    path.moveTo(-1.5 * scale, 1.0 * scale);
    path.lineTo(1.5 * scale, 1.0 * scale);

    for (let i = 0; i < 5; i++) {
        let offset = i * 0.5 * scale;
        path.moveTo(offset + -1.0 * scale, 1.0 * scale);
        path.lineTo(offset + -1.5 * scale, 1.5 * scale);
    }

    return path;
}

function jointFree(scale: number): Path2D {
    let path = new Path2D();
    path.moveTo(0.25 * scale, 0.0);
    path.arc(0.0, 0.0, 0.25 * scale, 0.0, 2 * 3.14159);
    return path;
}

function demoTruss(): [Node[], Element[]] {
    let joints = [
        new Node(new Vec2(300, 200), JointType.Fixed),
        new Node(new Vec2(400, 200), JointType.Free),
        new Node(new Vec2(400, 300), JointType.Free),
        new Node(new Vec2(500, 200), JointType.Free),
        new Node(new Vec2(500, 300), JointType.Free),
        new Node(new Vec2(300, 300), JointType.Roller),
    ];
    joints[0].orientation = 90;
    joints[5].orientation = 90;
    joints[4].force = new Vec2(0, 200000);

    let members = [
        new Element(joints[0], joints[1]),
        new Element(joints[0], joints[2]),
        new Element(joints[0], joints[5]),

        new Element(joints[1], joints[2]),
        new Element(joints[1], joints[3]),
        new Element(joints[1], joints[4]),

        new Element(joints[2], joints[4]),
        new Element(joints[3], joints[4]),
        new Element(joints[2], joints[5]),
    ];

    return [joints, members];
}