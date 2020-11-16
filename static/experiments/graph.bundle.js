// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      const e = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(e)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
      return v;
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("math", [], function (exports_1, context_1) {
    "use strict";
    var Vec2, Matrix;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Vec2 = class Vec2 {
                constructor(x, y) {
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
            };
            exports_1("Vec2", Vec2);
            Matrix = class Matrix {
                constructor(n, m) {
                    this.n = n;
                    this.m = m;
                    this.data = new Float32Array(n * m);
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
                    for (const i in this.data) {
                        let l = this.data[i].toString().length;
                        if (l > maxLen) {
                            maxLen = l;
                        }
                    }
                    for (let i = 0; i < this.n; i++) {
                        out += "|";
                        for (let j = 0; j < this.m; j++) {
                            out += `${this.get(i, j)} `.padStart(maxLen + 1, " ");
                        }
                        out += "|\n";
                    }
                    return out;
                }
                static randomLowerMatrix(n) {
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
            };
            exports_1("Matrix", Matrix);
        }
    };
});
System.register("common", ["math"], function (exports_2, context_2) {
    "use strict";
    var math_ts_1;
    var __moduleName = context_2 && context_2.id;
    function getMousePos(canvas, ev) {
        var rect = canvas.getBoundingClientRect(), scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
        return new math_ts_1.Vec2((ev.clientX - rect.left) * scaleX, (ev.clientY - rect.top) * scaleY);
    }
    exports_2("getMousePos", getMousePos);
    return {
        setters: [
            function (math_ts_1_1) {
                math_ts_1 = math_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("graph", ["math", "common"], function (exports_3, context_3) {
    "use strict";
    var math_ts_2, common_ts_1, Graph, GraphNode;
    var __moduleName = context_3 && context_3.id;
    function main() {
        let mat = math_ts_2.Matrix.randomLowerMatrix(8);
        console.log(mat.toString());
        let nodes = [];
        for (let i = 0; i < mat.n; i++) {
            nodes.push(new GraphNode(i));
        }
        let graph = new Graph(nodes, mat);
        graph.canvas.addEventListener("mousedown", (ev) => graph.onMouseDown(ev));
        graph.canvas.addEventListener("mousemove", (ev) => {
            graph.mousePos = common_ts_1.getMousePos(graph.canvas, ev);
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
    exports_3("main", main);
    return {
        setters: [
            function (math_ts_2_1) {
                math_ts_2 = math_ts_2_1;
            },
            function (common_ts_1_1) {
                common_ts_1 = common_ts_1_1;
            }
        ],
        execute: function () {
            Graph = class Graph {
                constructor(nodes, edges) {
                    this.canvas = document.getElementById("canvas");
                    this.ctx = this.canvas.getContext("2d");
                    this.mousePos = new math_ts_2.Vec2(0, 0);
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
                    for (let i = 0; i < this.nodes.length; i++) {
                        if (this.nodes[i].selected) {
                            this.nodes[i].f = this.nodes[i].f.sub(this.nodes[i].p.sub(this.mousePos).mul(5));
                        }
                        for (let j = 0; j < this.edges.n; j++) {
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
                            let force = unit.mul(Math.sqrt((TR - dist) * (TR - dist)));
                            if (this.edges.get(i, j) != 0) {
                                this.nodes[i].f = this.nodes[i].f.sub(force.mul(0.75));
                                this.nodes[j].f = this.nodes[j].f.add(force.mul(0.75));
                            }
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
                        node.f = new math_ts_2.Vec2(0, 0);
                    }
                }
                onMouseDown(ev) {
                    let mousePos = common_ts_1.getMousePos(this.canvas, ev);
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
            };
            GraphNode = class GraphNode {
                constructor(value) {
                    this.value = value;
                    this.p = new math_ts_2.Vec2(Math.round(Math.random() * 300) + (960 / 2) - 150, Math.round(Math.random() * 300) + (540 / 2) - 150);
                    this.f = new math_ts_2.Vec2(0, 0);
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
            };
        }
    };
});

const __exp = __instantiate("graph", false);
export const main = __exp["main"];
