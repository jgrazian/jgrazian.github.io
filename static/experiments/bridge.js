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
import init, { Matrix, Vec2, Vector } from "./newton-2d/newton_2d.js";
//import { getMousePos } from "./common"
var g = 9.81;
export function main() {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, ctx, joints, members, t, sol;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, init()];
                case 1:
                    _a.sent();
                    canvas = document.getElementById('canvas');
                    ctx = canvas.getContext('2d');
                    joints = [
                        new Node(new Vec2(100, 200), SolverType.static),
                        new Node(new Vec2(150, 100), SolverType.dynamic),
                        new Node(new Vec2(300, 200), SolverType.static),
                    ];
                    joints[1].force = new Vec2(0, -1732);
                    members = [
                        new Element(joints[0], joints[1]),
                        new Element(joints[1], joints[2]),
                    ];
                    joints.forEach(function (j) { return j.draw(ctx); });
                    members.forEach(function (m) { return m.draw(ctx); });
                    t = new Truss(joints, members);
                    console.log(t.globalStiffnessMatrix().to_string());
                    console.log(t.forceVector().to_string());
                    sol = t.solve();
                    console.log(sol[0].to_string());
                    console.log(sol[1].to_string());
                    return [2 /*return*/];
            }
        });
    });
}
var SolverType;
(function (SolverType) {
    SolverType[SolverType["static"] = 0] = "static";
    SolverType[SolverType["kinematic"] = 1] = "kinematic";
    SolverType[SolverType["dynamic"] = 2] = "dynamic";
})(SolverType || (SolverType = {}));
var Node = /** @class */ (function () {
    function Node(pos, type) {
        this.pos = new Vec2(0.0, 0.0);
        this.type = SolverType.dynamic;
        this.force = new Vec2(0.0, 0.0);
        this.pos = pos;
        if (type != undefined) {
            this.type = type;
        }
    }
    Node.prototype.draw = function (ctx) {
        var r = 10.0;
        ctx.lineWidth = 3.0;
        if (this.type == SolverType.dynamic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 0.5 * r, 0.0, 2 * 3.14159);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, r, 0.0, 2 * 3.14159);
            ctx.stroke();
        }
        else if (this.type == SolverType.kinematic) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, r, 0.0, 2 * 3.14159);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.pos.x + r, this.pos.y);
            ctx.lineTo(this.pos.x - r, this.pos.y);
            ctx.moveTo(this.pos.x, this.pos.y + r);
            ctx.lineTo(this.pos.x, this.pos.y - r);
            ctx.stroke();
        }
        else {
            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.pos.x + 1.5 * r, this.pos.y + 1.5 * r);
            ctx.lineTo(this.pos.x - 1.5 * r, this.pos.y + 1.5 * r);
            ctx.lineTo(this.pos.x, this.pos.y);
            ctx.stroke();
        }
    };
    return Node;
}());
var Element = /** @class */ (function () {
    function Element(i, j) {
        this.size = 1;
        this.i = i;
        this.j = j;
    }
    Element.prototype.length = function () {
        return (this.j.pos.sub(this.i.pos)).len();
    };
    Element.prototype.angle = function () {
        return (this.j.pos.sub(this.i.pos)).angle();
    };
    Element.prototype.draw = function (ctx) {
        var baseWidth = 5.0;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.size + baseWidth;
        ctx.beginPath();
        ctx.moveTo(this.i.pos.x, this.i.pos.y);
        ctx.lineTo(this.j.pos.x, this.j.pos.y);
        ctx.stroke();
    };
    Element.prototype.localStiffnessMatrix = function () {
        var E = 31.4 * Math.pow(10, 6); // E of steel
        var A = this.size * this.size;
        var L = this.length();
        var AEL = (A * E) / L;
        var theta = this.angle();
        var c = Math.cos(theta);
        var s = Math.sin(theta);
        var data = new Float64Array([
            AEL * c * c, AEL * c * s, -AEL * c * c, -AEL * c * s,
            AEL * c * s, AEL * s * s, -AEL * c * s, -AEL * s * s,
            -AEL * c * c, -AEL * c * s, AEL * c * c, AEL * c * s,
            -AEL * c * s, -AEL * s * s, AEL * c * s, AEL * s * s
        ]);
        return Matrix.from(4, 4, data);
    };
    return Element;
}());
var Truss = /** @class */ (function () {
    function Truss(nodes, elements) {
        this.nodes = (nodes != undefined) ? nodes : [];
        this.elements = (elements != undefined) ? elements : [];
    }
    // http://web.mit.edu/course/3/3.11/www/modules/fea.pdf
    Truss.prototype.solve = function () {
        var m = this.globalStiffnessMatrix();
        var f = this.forceVector();
        var u = new Vector(f.n);
        var freeNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type != SolverType.static) {
                freeNodes.push(i * 2 + 0);
                freeNodes.push(i * 2 + 1);
            }
        }
        // Solve for displacements
        var f_reduced = Vector.from(new Float64Array(freeNodes.map(function (n) { return f.get(n); })));
        var m_reduced = m.get_rows_columns(new Uint32Array(freeNodes), new Uint32Array(freeNodes));
        var u_reduced = m_reduced.solve_mut(f_reduced);
        // Solve for forces
        // Sub u_red back into the full u
        for (var i = 0; i < u_reduced.n; i++) {
            u.set(freeNodes[i], u_reduced.get(i));
        }
        f = m.mul_vec(u);
        return [f, u];
    };
    Truss.prototype.forceVector = function () {
        var f = new Vector(this.nodes.length * 2);
        for (var i = 0; i < this.nodes.length; i++) {
            var idx = i * 2;
            f.set(idx + 0, this.nodes[i].force.x);
            f.set(idx + 1, this.nodes[i].force.y);
        }
        return f;
    };
    Truss.prototype.globalStiffnessMatrix = function () {
        var m = new Matrix(this.nodes.length * 2, this.nodes.length * 2);
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            var lm = element.localStiffnessMatrix();
            // Index of element's nodes
            var ni0 = this.nodes.indexOf(element.i);
            var ni1 = this.nodes.indexOf(element.j);
            // Actual index in matrix
            var mi0 = ni0 * 2;
            var mi1 = ni1 * 2;
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
    };
    return Truss;
}());
