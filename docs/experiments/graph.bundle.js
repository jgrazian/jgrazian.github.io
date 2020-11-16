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
function getMousePos(canvas, ev) {
    var rect = canvas.getBoundingClientRect(), scaleX, scaleY;
    return new Vec2((ev.clientX - rect.left) * (canvas.width / rect.width), (ev.clientY - rect.top) * (canvas.height / rect.height));
}
export function main() {
    let mat = Matrix.randomLowerMatrix(8);
    console.log(mat.toString());
    let nodes = [];
    for(let i = 0; i < mat.n; i++){
        nodes.push(new GraphNode(i));
    }
    let graph = new Graph(nodes, mat);
    graph.canvas.addEventListener("mousedown", (ev)=>graph.onMouseDown(ev)
    );
    graph.canvas.addEventListener("mousemove", (ev)=>{
        graph.mousePos = getMousePos(graph.canvas, ev);
    });
    graph.canvas.addEventListener("mouseup", (ev)=>graph.onMouseUp(ev)
    );
    function step(dt) {
        graph.ctx.clearRect(0, 0, 1000, 1000);
        graph.update(0.05);
        graph.draw();
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}
class Graph {
    canvas = document.getElementById("canvas");
    ctx = this.canvas.getContext("2d");
    mousePos = new Vec2(0, 0);
    constructor(nodes, edges){
        if (edges.m != edges.n || edges.m != nodes.length) {
            throw "Unequal nodes and edges";
        }
        this.nodes = nodes;
        this.edges = edges;
        this.ctx.lineWidth = 2;
        this.ctx.font = "15px Sans";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
    }
    draw() {
        for(let i = 0; i < this.edges.m; i++){
            this.nodes[i].draw(this.ctx);
            for(let j = 0; j < this.edges.n; j++){
                if (i == j) {
                    continue;
                }
                if (this.edges.get(i, j) != 0) {
                    let v = this.nodes[i].p.sub(this.nodes[j].p);
                    let start = v.unit().mul(-this.nodes[i].r).add(this.nodes[i].p);
                    let end = v.unit().mul(this.nodes[j].r).add(this.nodes[j].p);
                    this.ctx.beginPath();
                    this.ctx.moveTo(start.x, start.y);
                    this.ctx.lineTo(end.x, end.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    update(dt) {
        const TR = 200;
        const EPS = 0.1;
        for(let i = 0; i < this.nodes.length; i++){
            if (this.nodes[i].selected) {
                this.nodes[i].f = this.nodes[i].f.sub(this.nodes[i].p.sub(this.mousePos).mul(5));
            }
            for(let j = 0; j < this.edges.n; j++){
                if (i == j) {
                    continue;
                }
                let v = this.nodes[i].p.sub(this.nodes[j].p);
                let unit = v.unit();
                let dist = v.len();
                if (dist <= this.nodes[i].r + this.nodes[j].r) {
                    let force = unit.mul(50);
                    this.nodes[i].f = this.nodes[i].f.add(force);
                    this.nodes[j].f = this.nodes[j].f.sub(force);
                }
                let force = unit.mul(Math.sqrt((200 - dist) * (200 - dist)));
                if (this.edges.get(i, j) != 0) {
                    this.nodes[i].f = this.nodes[i].f.sub(force.mul(0.75));
                    this.nodes[j].f = this.nodes[j].f.add(force.mul(0.75));
                }
                if (dist < 200 + 0.1) {
                    this.nodes[i].f = this.nodes[i].f.add(force);
                    this.nodes[j].f = this.nodes[j].f.sub(force);
                } else if (dist > 200 - 0.1) {
                    this.nodes[i].f = this.nodes[i].f.sub(force);
                    this.nodes[j].f = this.nodes[j].f.add(force);
                }
            }
        }
        for (let node of this.nodes){
            node.p = node.p.add(node.f.mul(dt));
            node.f = new Vec2(0, 0);
        }
    }
    onMouseDown(ev) {
        let mousePos = getMousePos(this.canvas, ev);
        for (let node of this.nodes){
            let d = node.p.sub(mousePos).len();
            if (d <= node.r) {
                node.selected = true;
            }
        }
    }
    onMouseUp(ev) {
        for (let node of this.nodes){
            node.selected = false;
        }
    }
}
class GraphNode {
    constructor(value){
        this.value = value;
        this.p = new Vec2(Math.round(Math.random() * 300) + 960 / 2 - 150, Math.round(Math.random() * 300) + 540 / 2 - 150);
        this.f = new Vec2(0, 0);
        this.r = 20;
        this.selected = false;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r, 0, 3.14159 * 2);
        if (this.selected) {
            ctx.fillStyle = "#E5E8E8 ";
            ctx.fill();
            ctx.fillStyle = "black";
        }
        ctx.stroke();
        ctx.fillText(this.value.toString(), this.p.x, this.p.y);
    }
}
