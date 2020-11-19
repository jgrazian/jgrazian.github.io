class Vec2 {
    constructor(x, y1){
        this.x = x;
        this.y = y1;
    }
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lenSq() {
        return this.x * this.x + this.y * this.y;
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    angleTo(other) {
        return Math.acos((this.x * other.x + this.y * other.y) / (this.len() * other.len()));
    }
    rotate(a) {
        let xp = Math.cos(a) * this.x - Math.sin(a) * this.y;
        let yp = Math.sin(a) * this.x + Math.cos(a) * this.y;
        return new Vec2(xp, yp);
    }
    normalize() {
        let l = this.len();
        if (l == 0) {
            return new Vec2(0, 0);
        }
        return new Vec2(this.x / l, this.y / l);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    mul(other) {
        return new Vec2(this.x * other, this.y * other);
    }
    div(other) {
        return new Vec2(this.x / other, this.y / other);
    }
}
class Matrix {
    constructor(n1, m1){
        this.n = n1;
        this.m = m1;
        this.data = new Float32Array(n1 * m1);
    }
    static from(n, m, d) {
        let data = Float32Array.from(d);
        if (data.length != n * m) {
            throw `Given data length can not be made into matrix of size ${n}x${m}`;
        }
        let mat = new Matrix(n, m);
        mat.data = data;
        return mat;
    }
    get(i, j) {
        return this.data[i * this.m + j];
    }
    set(i, j, v) {
        this.data[i * this.m + j] = v;
    }
    toString() {
        const numDigits = 4;
        let out = "";
        let maxLen = 0;
        for(const i in this.data){
            let l = this.data[i].toFixed(4).toString().length;
            if (l > maxLen) {
                maxLen = l;
            }
        }
        for(let i1 = 0; i1 < this.n; i1++){
            out += "|";
            for(let j = 0; j < this.m; j++){
                out += `${this.get(i1, j).toFixed(4)} `.padStart(maxLen + 1, " ");
            }
            out += "|\n";
        }
        return out;
    }
    static randomLowerMatrix(n) {
        let mat = new Matrix(n, n);
        for(let i = 0; i < n; i++){
            for(let j = 0; j <= i; j++){
                if (Math.random() < 0.35) {
                    mat.set(i, j, Math.round(Math.random() * 10));
                }
            }
        }
        return mat;
    }
    swapRow(r0, r1) {
        let temp = [];
        for(let j = 0; j < this.n; j++){
            temp.push(this.get(r0, j));
            this.set(r0, j, this.get(r1, j));
        }
        for(let j1 = 0; j1 < this.n; j1++){
            this.set(r1, j1, temp[j1]);
        }
    }
    gaussianElimination(b) {
        let n2 = this.n;
        for(let j = 0; j < n2 - 1; j++){
            console.log(j);
            let maxVal = Math.abs(this.get(j, j));
            let maxRow = j;
            for(let i = j + 1; i < n2; i++){
                let curVal = Math.abs(this.get(i, j));
                if (curVal > maxVal) {
                    maxVal = curVal;
                    maxRow = i;
                }
            }
            if (maxVal < 0.00001) {
                console.log('Skip row');
                continue;
            }
            if (maxRow != j) {
                console.log(`Swapping ${j} and ${maxRow}`);
                this.swapRow(j, maxRow);
                b.swapRow(j, maxRow);
            }
            for(let i1 = j + 1; i1 < n2; i1++){
                let m2 = this.get(i1, j) / this.get(j, j);
                for(let k = j; k < n2; k++){
                    this.set(i1, k, this.get(i1, k) - m2 * this.get(j, k));
                    console.log(this.toString());
                }
                b.set(i1, b.get(i1) - m2 * b.get(j));
            }
        }
    }
    backSubstitution(y) {
        let x1 = new Vector(this.n);
        for(let i = this.n - 1; i >= 0; i--){
            x1.set(i, y.get(i));
            for(let j = i + 1; j <= this.n - 1; j++){
                x1.set(i, x1.get(i) - this.get(i, j) * x1.get(j));
            }
            x1.set(i, x1.get(i) / this.get(i, i));
        }
        return x1;
    }
    solve(b) {
        let bCopy = new Vector(b.n);
        bCopy.data = Float32Array.from(b.data);
        this.gaussianElimination(bCopy);
        console.log(this.toString());
        return this.backSubstitution(bCopy);
    }
}
class Vector {
    constructor(n2){
        this.n = n2;
        this.data = new Float32Array(n2);
    }
    static from(d) {
        let data = Float32Array.from(d);
        let v = new Vector(data.length);
        v.data = data;
        return v;
    }
    get(i) {
        return this.data[i];
    }
    set(i, v) {
        this.data[i] = v;
    }
    swapRow(r0, r1) {
        let temp = this.get(r0);
        this.set(r0, r1);
        this.set(r1, temp);
    }
    toString() {
        let out = "";
        let maxLen = 0;
        for(const i in this.data){
            let l = this.data[i].toString().length;
            if (l > maxLen) {
                maxLen = l;
            }
        }
        for(let i1 = 0; i1 < this.n; i1++){
            out += "| ";
            out += `${this.get(i1)} `.padStart(maxLen + 1, " ");
            out += "|\n";
        }
        return out;
    }
}
function test() {
    let data;
    let mat = Matrix.from(3, 3, [
        9,
        3,
        4,
        4,
        3,
        4,
        1,
        1,
        1
    ]);
    let b = Vector.from([
        7,
        8,
        3
    ]);
    console.log(mat.solve(b));
}
test();
export function main() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let joints = [
        new Node1(new Vec2(-5, 0), SolverType.static),
        new Node1(new Vec2(0, -8.66), SolverType.dynamic),
        new Node1(new Vec2(5, 0), SolverType.static), 
    ];
    joints[1].force = new Vec2(0, -1732);
    let members = [
        new Element1(joints[0], joints[1]),
        new Element1(joints[1], joints[2]), 
    ];
    joints.forEach((j)=>j.draw(ctx)
    );
    members.forEach((m2)=>m2.draw(ctx)
    );
    let t = new Truss(joints, members);
    console.log(t.globalStiffnessMatrix().toString());
    console.log(t.forceVector().toString());
    console.log(t.solve().toString());
}
var SolverType;
(function(SolverType1) {
    SolverType1[SolverType1["static"] = 0] = "static";
    SolverType1[SolverType1["kinematic"] = 1] = "kinematic";
    SolverType1[SolverType1["dynamic"] = 2] = "dynamic";
})(SolverType || (SolverType = {
}));
class Node1 {
    pos = new Vec2(0, 0);
    type = SolverType.dynamic;
    force = new Vec2(0, 0);
    constructor(pos, type){
        this.pos = pos;
        if (type != undefined) {
            this.type = type;
        }
    }
    draw(ctx) {
        const r = 10;
        ctx.lineWidth = 3;
        if (this.type == SolverType.dynamic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 0.5 * 10, 0, 2 * 3.14159);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * 3.14159);
            ctx.stroke();
        } else if (this.type == SolverType.kinematic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * 3.14159);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.pos.x + 10, this.pos.y);
            ctx.lineTo(this.pos.x - 10, this.pos.y);
            ctx.moveTo(this.pos.x, this.pos.y + 10);
            ctx.lineTo(this.pos.x, this.pos.y - 10);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.pos.x + 1.5 * 10, this.pos.y + 1.5 * 10);
            ctx.lineTo(this.pos.x - 1.5 * 10, this.pos.y + 1.5 * 10);
            ctx.lineTo(this.pos.x, this.pos.y);
            ctx.stroke();
        }
    }
}
class Element1 {
    size = 1;
    constructor(i, j){
        this.i = i;
        this.j = j;
    }
    length() {
        return this.j.pos.sub(this.i.pos).len();
    }
    angle() {
        return this.j.pos.sub(this.i.pos).angle();
    }
    draw(ctx) {
        const baseWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size + 5;
        ctx.beginPath();
        ctx.moveTo(this.i.pos.x, this.i.pos.y);
        ctx.lineTo(this.j.pos.x, this.j.pos.y);
        ctx.stroke();
    }
    localStiffnessMatrix() {
        const E = 10 * 1000;
        const A = 0.1;
        const L = this.length();
        const AEL = 0.1 * E / L;
        const theta = this.angle();
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        let m2 = new Matrix(4, 4);
        m2.set(0, 0, AEL * c * c);
        m2.set(0, 1, AEL * c * s);
        m2.set(0, 2, -AEL * c * c);
        m2.set(0, 3, -AEL * c * s);
        m2.set(1, 0, AEL * c * s);
        m2.set(1, 1, AEL * s * s);
        m2.set(1, 2, -AEL * c * s);
        m2.set(1, 3, -AEL * s * s);
        m2.set(2, 0, -AEL * c * c);
        m2.set(2, 1, -AEL * c * s);
        m2.set(2, 2, AEL * c * c);
        m2.set(2, 3, AEL * c * s);
        m2.set(3, 0, -AEL * c * s);
        m2.set(3, 1, -AEL * s * s);
        m2.set(3, 2, AEL * c * s);
        m2.set(3, 3, AEL * s * s);
        return m2;
    }
}
class Truss {
    constructor(nodes, elements){
        this.nodes = nodes != undefined ? nodes : [];
        this.elements = elements != undefined ? elements : [];
    }
    solve() {
        let m2 = this.globalStiffnessMatrix();
        let f = this.forceVector();
        return m2.solve(f);
    }
    forceVector() {
        let f = new Vector(this.nodes.length * 2);
        for(let i1 = 0; i1 < this.nodes.length; i1++){
            let ind = i1 * 2;
            f.set(ind + 0, this.nodes[i1].force.x);
            f.set(ind + 1, this.nodes[i1].force.y);
        }
        return f;
    }
    globalStiffnessMatrix() {
        let m2 = new Matrix(this.nodes.length * 2, this.nodes.length * 2);
        for (let element of this.elements){
            const lm = element.localStiffnessMatrix();
            const ni0 = this.nodes.indexOf(element.i);
            const ni1 = this.nodes.indexOf(element.j);
            const mi0 = ni0 * 2;
            const mi1 = ni1 * 2;
            m2.set(mi0 + 0, mi0 + 0, m2.get(mi0 + 0, mi0 + 0) + lm.get(0, 0));
            m2.set(mi0 + 0, mi0 + 1, m2.get(mi0 + 0, mi0 + 1) + lm.get(0, 1));
            m2.set(mi0 + 1, mi0 + 0, m2.get(mi0 + 1, mi0 + 0) + lm.get(1, 0));
            m2.set(mi0 + 1, mi0 + 1, m2.get(mi0 + 1, mi0 + 1) + lm.get(1, 1));
            m2.set(mi1 + 0, mi0 + 0, m2.get(mi1 + 0, mi0 + 0) + lm.get(2, 0));
            m2.set(mi1 + 0, mi0 + 1, m2.get(mi1 + 0, mi0 + 1) + lm.get(2, 1));
            m2.set(mi1 + 1, mi0 + 0, m2.get(mi1 + 1, mi0 + 0) + lm.get(3, 0));
            m2.set(mi1 + 1, mi0 + 1, m2.get(mi1 + 1, mi0 + 1) + lm.get(3, 1));
            m2.set(mi0 + 0, mi1 + 0, m2.get(mi0 + 0, mi1 + 0) + lm.get(0, 2));
            m2.set(mi0 + 0, mi1 + 1, m2.get(mi0 + 0, mi1 + 1) + lm.get(0, 3));
            m2.set(mi0 + 1, mi1 + 0, m2.get(mi0 + 1, mi1 + 0) + lm.get(1, 2));
            m2.set(mi0 + 1, mi1 + 1, m2.get(mi0 + 1, mi1 + 1) + lm.get(1, 3));
            m2.set(mi1 + 0, mi1 + 0, m2.get(mi1 + 0, mi1 + 0) + lm.get(2, 2));
            m2.set(mi1 + 0, mi1 + 1, m2.get(mi1 + 0, mi1 + 1) + lm.get(2, 3));
            m2.set(mi1 + 1, mi1 + 0, m2.get(mi1 + 1, mi1 + 0) + lm.get(3, 2));
            m2.set(mi1 + 1, mi1 + 1, m2.get(mi1 + 1, mi1 + 1) + lm.get(3, 3));
        }
        return m2;
    }
}
