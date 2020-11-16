class Vec2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
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
    unit() {
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
        return new Vec2(this.x * other, this.y * other);
    }
}
class Matrix {
    constructor(n1, m){
        this.n = n1;
        this.m = m;
        this.data = new Float32Array(n1 * m);
    }
    get(i, j) {
        return this.data[i * this.m + j];
    }
    set(i, j, v) {
        this.data[i * this.m + j] = v;
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
            out += "|";
            for(let j = 0; j < this.m; j++){
                out += `${this.get(i1, j)} `.padStart(maxLen + 1, " ");
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
}
export function main() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let j0 = new Joint(new Vec2(200, 350), SolverType.static);
    let j1 = new Joint(new Vec2(300, 350), SolverType.dynamic);
    let m1 = new Member(j0, j1);
    j0.draw(ctx);
    j1.draw(ctx);
    m1.draw(ctx);
}
var SolverType;
(function(SolverType1) {
    SolverType1[SolverType1["static"] = 0] = "static";
    SolverType1[SolverType1["kinematic"] = 1] = "kinematic";
    SolverType1[SolverType1["dynamic"] = 2] = "dynamic";
})(SolverType || (SolverType = {
}));
class Joint {
    pos = new Vec2(0, 0);
    members = [];
    translation = SolverType.dynamic;
    rotation = SolverType.dynamic;
    constructor(pos, type){
        this.pos = pos;
        if (type != undefined) {
            this.translation = type;
            this.rotation = type;
        }
    }
    draw(ctx) {
        const r = 10;
        ctx.lineWidth = 3;
        if (this.translation == SolverType.dynamic || this.rotation == SolverType.dynamic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 0.5 * 10, 0, 2 * 3.14159);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 10, 0, 2 * 3.14159);
            ctx.stroke();
        } else if (this.translation == SolverType.kinematic || this.rotation == SolverType.kinematic) {
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
class Member {
    size = 1;
    constructor(j0, j1){
        this.j0 = j0;
        this.j1 = j1;
        j0.members.push(this);
        j1.members.push(this);
    }
    draw(ctx) {
        const baseWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size + 5;
        ctx.beginPath();
        ctx.moveTo(this.j0.pos.x, this.j0.pos.y);
        ctx.lineTo(this.j1.pos.x, this.j1.pos.y);
        ctx.stroke();
    }
    update(dt) {
    }
}
