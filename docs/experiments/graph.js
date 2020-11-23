import init, { Matrix, Vec2 } from "./newton-2d/newton_2d.js";
import { getMousePos } from "./common.js";
export async function main() {
    await init();
    let mat = randomLowerMatrix(8);
    console.log(mat.toString());
    let nodes = [];
    for (let i = 0; i < mat.n; i++) {
        nodes.push(new GraphNode(i));
    }
    let graph = new Graph(nodes, mat);
    graph.canvas.addEventListener("mousedown", (ev) => graph.onMouseDown(ev));
    graph.canvas.addEventListener("mousemove", (ev) => {
        graph.mousePos = getMousePos(graph.canvas, ev);
    });
    graph.canvas.addEventListener("mouseup", (ev) => graph.onMouseUp(ev));
    function step(dt) {
        graph.ctx.clearRect(0, 0, 1000, 1000);
        graph.update(0.05);
        graph.draw();
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}
class Graph {
    constructor(nodes, edges) {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.mousePos = new Vec2(0, 0);
        if (edges.m != edges.n || edges.m != nodes.length) {
            throw "Unequal nodes and edges";
        }
        this.nodes = nodes;
        this.edges = edges;
        this.ctx.lineWidth = 2.0;
        this.ctx.font = "15px Sans";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
    }
    draw() {
        for (let i = 0; i < this.edges.m; i++) {
            this.nodes[i].draw(this.ctx);
            for (let j = 0; j < this.edges.n; j++) {
                if (i == j) { // todo self connection
                    continue;
                }
                if (this.edges.get(i, j) != 0) {
                    let v = this.nodes[i].p.sub(this.nodes[j].p);
                    let start = v.normalize().mul(-this.nodes[i].r).add(this.nodes[i].p);
                    let end = v.normalize().mul(this.nodes[j].r).add(this.nodes[j].p);
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
        for (let i = 0; i < this.nodes.length; i++) {
            // If selected move to mouse
            if (this.nodes[i].selected) {
                this.nodes[i].f = this.nodes[i].f.sub(this.nodes[i].p.sub(this.mousePos).mul(5));
            }
            for (let j = 0; j < this.edges.n; j++) {
                // Can't move based on own position
                if (i == j) {
                    continue;
                }
                let v = this.nodes[i].p.sub(this.nodes[j].p);
                let unit = v.normalize();
                let dist = v.len();
                // Node collision
                if (dist <= this.nodes[i].r + this.nodes[j].r) {
                    let force = unit.mul(50);
                    this.nodes[i].f = this.nodes[i].f.add(force);
                    this.nodes[j].f = this.nodes[j].f.sub(force);
                }
                let force = unit.mul(Math.sqrt((TR - dist) * (TR - dist)));
                // Bias slightly twoards connections
                if (this.edges.get(i, j) != 0) {
                    this.nodes[i].f = this.nodes[i].f.sub(force.mul(0.75));
                    this.nodes[j].f = this.nodes[j].f.add(force.mul(0.75));
                }
                // Spring force
                if (dist < TR + EPS) {
                    this.nodes[i].f = this.nodes[i].f.add(force);
                    this.nodes[j].f = this.nodes[j].f.sub(force);
                }
                else if (dist > TR - EPS) {
                    this.nodes[i].f = this.nodes[i].f.sub(force);
                    this.nodes[j].f = this.nodes[j].f.add(force);
                }
            }
        }
        for (let node of this.nodes) {
            node.p = node.p.add(node.f.mul(dt));
            node.f = new Vec2(0, 0);
        }
    }
    onMouseDown(ev) {
        let mousePos = getMousePos(this.canvas, ev);
        for (let node of this.nodes) {
            let d = node.p.sub(mousePos).len();
            if (d <= node.r) {
                node.selected = true;
            }
        }
    }
    onMouseUp(ev) {
        for (let node of this.nodes) {
            node.selected = false;
        }
    }
}
class GraphNode {
    constructor(value) {
        this.value = value;
        this.p = new Vec2(Math.round(Math.random() * 300) + (960 / 2) - 150, Math.round(Math.random() * 300) + (540 / 2) - 150);
        this.f = new Vec2(0, 0);
        this.r = 20;
        this.selected = false;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r, 0.0, 3.14159 * 2.0);
        if (this.selected) {
            ctx.fillStyle = "#E5E8E8 ";
            ctx.fill();
            ctx.fillStyle = "black";
        }
        ctx.stroke();
        ctx.fillText(this.value.toString(), this.p.x, this.p.y);
    }
}
function randomLowerMatrix(n) {
    let mat = new Matrix(n, n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            if (Math.random() < 0.35) {
                mat.set(i, j, Math.round(Math.random() * 10));
            }
        }
    }
    return mat;
}
