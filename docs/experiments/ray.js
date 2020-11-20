import { Vec2 } from './math';
var g = 9.81;
var G = 1;
var c = 125;
export function main() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var t = 0.0;
    var rays = [];
    var M = 10000;
    var rs = 1;
    var masses = [new Mass(M, new Vec2(960 / 2, 540 / 2), rs)];
    console.log(Math.sqrt(G * M / 100));
    for (var i = 0; i < 120; i++) {
        rays.push(new Ray(new Vec2(960 / 2, 540 / 2 + i * 10), new Vec2(c, 0.0)));
    }
    function step(ts) {
        var dt = (ts - t) / 1000.0;
        for (var _i = 0, rays_1 = rays; _i < rays_1.length; _i++) {
            var r = rays_1[_i];
            r.stepWithPlanets(ctx, dt, masses);
        }
        for (var _a = 0, masses_1 = masses; _a < masses_1.length; _a++) {
            var m = masses_1[_a];
            ctx.fillStyle = "black";
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.arc(m.o.x, m.o.y, m.r, 0.0, 3.14159 * 2.0);
            ctx.fill();
        }
        t = ts;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
}
var Ray = /** @class */ (function () {
    function Ray(o, d) {
        this.o = o;
        this.d = d;
    }
    Ray.prototype.at = function (t) {
        return (this.d.mul(t)).add(this.o);
    };
    Ray.prototype.rotate = function (a) {
        this.d = this.d.rotate(a);
    };
    Ray.prototype.draw = function (ctx) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        // Dot
        ctx.beginPath();
        ctx.arc(this.o.x, this.o.y, 2.0, 0.0, 3.14159 * 2.0);
        ctx.fill();
        // Line
        var line = this.o.add(this.d.normalize().mul(25.0));
        ctx.beginPath();
        ctx.moveTo(this.o.x, this.o.y);
        ctx.lineTo(line.x, line.y);
        ctx.stroke();
    };
    Ray.prototype.step = function (ctx, dt) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        var p = this.at(dt);
        // Line
        ctx.beginPath();
        ctx.moveTo(this.o.x, this.o.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        this.o = p;
    };
    Ray.prototype.stepWithGravity = function (ctx, dt) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        this.d.y += g * dt / 1;
        var p = this.at(dt);
        // Line
        ctx.beginPath();
        ctx.moveTo(this.o.x, this.o.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        this.o = p;
    };
    Ray.prototype.stepWithPlanets = function (ctx, dt, masses) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        var r = Infinity;
        var m = masses[0];
        for (var _i = 0, masses_2 = masses; _i < masses_2.length; _i++) {
            var mass = masses_2[_i];
            var l = this.o.sub(mass.o).lenSq();
            if (l < r) {
                r = l;
                m = mass;
            }
        }
        r = Math.sqrt(r);
        // theta = 4GM / rc^2
        var theta = 4 * G * m.m / (r * this.d.lenSq());
        var toMass = new Vec2(m.o.x - this.o.x, m.o.y - this.o.y);
        if (toMass.lenSq() <= m.r * m.r) {
            return;
        }
        var newDir = this.d.rotate(theta);
        if (newDir.angleTo(toMass) > this.d.angleTo(toMass)) {
            newDir = this.d.rotate(-theta);
        }
        this.d = newDir;
        var p = this.at(dt);
        // Line
        ctx.beginPath();
        ctx.moveTo(Math.round(this.o.x), Math.round(this.o.y));
        ctx.lineTo(Math.round(p.x), Math.round(p.y));
        ctx.stroke();
        this.o = p;
    };
    return Ray;
}());
var Mass = /** @class */ (function () {
    function Mass(m, o, r) {
        this.m = m;
        this.o = o;
        this.r = r;
    }
    return Mass;
}());
