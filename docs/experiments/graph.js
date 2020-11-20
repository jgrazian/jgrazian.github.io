var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import init, { Matrix, Vec2 } from "./newton-2d/newton_2d.js";
import { getMousePos } from "./common.js";
export function main() {
    return __awaiter(this, void 0, void 0, function () {
        function step(dt) {
            graph.ctx.clearRect(0, 0, 1000, 1000);
            graph.update(0.05);
            graph.draw();
            window.requestAnimationFrame(step);
        }
        var mat, nodes, i, graph;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, init()];
                case 1:
                    _a.sent();
                    mat = randomLowerMatrix(8);
                    console.log(mat.toString());
                    nodes = [];
                    for (i = 0; i < mat.n; i++) {
                        nodes.push(new GraphNode(i));
                    }
                    graph = new Graph(nodes, mat);
                    graph.canvas.addEventListener("mousedown", function (ev) { return graph.onMouseDown(ev); });
                    graph.canvas.addEventListener("mousemove", function (ev) {
                        graph.mousePos = getMousePos(graph.canvas, ev);
                    });
                    graph.canvas.addEventListener("mouseup", function (ev) { return graph.onMouseUp(ev); });
                    window.requestAnimationFrame(step);
                    return [2 /*return*/];
            }
        });
    });
}
var Graph = /** @class */ (function () {
    function Graph(nodes, edges) {
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
    Graph.prototype.draw = function () {
        for (var i = 0; i < this.edges.m; i++) {
            this.nodes[i].draw(this.ctx);
            for (var j = 0; j < this.edges.n; j++) {
                if (i == j) { // todo self connection
                    continue;
                }
                if (this.edges.get(i, j) != 0) {
                    var v = this.nodes[i].p.sub(this.nodes[j].p);
                    var start = v.normalize().mul(-this.nodes[i].r).add(this.nodes[i].p);
                    var end = v.normalize().mul(this.nodes[j].r).add(this.nodes[j].p);
                    this.ctx.beginPath();
                    this.ctx.moveTo(start.x, start.y);
                    this.ctx.lineTo(end.x, end.y);
                    this.ctx.stroke();
                }
            }
        }
    };
    Graph.prototype.update = function (dt) {
        var TR = 200;
        var EPS = 0.1;
        for (var i = 0; i < this.nodes.length; i++) {
            // If selected move to mouse
            if (this.nodes[i].selected) {
                this.nodes[i].f = this.nodes[i].f.sub(this.nodes[i].p.sub(this.mousePos).mul(5));
            }
            for (var j = 0; j < this.edges.n; j++) {
                // Can't move based on own position
                if (i == j) {
                    continue;
                }
                var v = this.nodes[i].p.sub(this.nodes[j].p);
                var unit = v.normalize();
                var dist = v.len();
                // Node collision
                if (dist <= this.nodes[i].r + this.nodes[j].r) {
                    var force_1 = unit.mul(50);
                    this.nodes[i].f = this.nodes[i].f.add(force_1);
                    this.nodes[j].f = this.nodes[j].f.sub(force_1);
                }
                var force = unit.mul(Math.sqrt((TR - dist) * (TR - dist)));
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
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.p = node.p.add(node.f.mul(dt));
            node.f = new Vec2(0, 0);
        }
    };
    Graph.prototype.onMouseDown = function (ev) {
        var mousePos = getMousePos(this.canvas, ev);
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var d = node.p.sub(mousePos).len();
            if (d <= node.r) {
                node.selected = true;
            }
        }
    };
    Graph.prototype.onMouseUp = function (ev) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.selected = false;
        }
    };
    return Graph;
}());
var GraphNode = /** @class */ (function () {
    function GraphNode(value) {
        this.value = value;
        this.p = new Vec2(Math.round(Math.random() * 300) + (960 / 2) - 150, Math.round(Math.random() * 300) + (540 / 2) - 150);
        this.f = new Vec2(0, 0);
        this.r = 20;
        this.selected = false;
    }
    GraphNode.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, this.r, 0.0, 3.14159 * 2.0);
        if (this.selected) {
            ctx.fillStyle = "#E5E8E8 ";
            ctx.fill();
            ctx.fillStyle = "black";
        }
        ctx.stroke();
        ctx.fillText(this.value.toString(), this.p.x, this.p.y);
    };
    return GraphNode;
}());
function randomLowerMatrix(n) {
    var mat = new Matrix(n, n);
    for (var i = 0; i < n; i++) {
        for (var j = 0; j <= i; j++) {
            if (Math.random() < 0.35) {
                mat.set(i, j, Math.round(Math.random() * 10));
            }
        }
    }
    return mat;
}
