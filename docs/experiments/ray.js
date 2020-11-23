import { Vec2 } from './math';
const g = 9.81;
const G = 1;
const c = 125;
export function main() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let t = 0.0;
    let rays = [];
    let M = 10000;
    let rs = 1;
    let masses = [new Mass(M, new Vec2(960 / 2, 540 / 2), rs)];
    console.log(Math.sqrt(G * M / 100));
    for (let i = 0; i < 120; i++) {
        rays.push(new Ray(new Vec2(960 / 2, 540 / 2 + i * 10), new Vec2(c, 0.0)));
    }
    function step(ts) {
        let dt = (ts - t) / 1000.0;
        for (let r of rays) {
            r.stepWithPlanets(ctx, dt, masses);
        }
        for (let m of masses) {
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
class Ray {
    constructor(o, d) {
        this.o = o;
        this.d = d;
    }
    at(t) {
        return (this.d.mul(t)).add(this.o);
    }
    rotate(a) {
        this.d = this.d.rotate(a);
    }
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        // Dot
        ctx.beginPath();
        ctx.arc(this.o.x, this.o.y, 2.0, 0.0, 3.14159 * 2.0);
        ctx.fill();
        // Line
        let line = this.o.add(this.d.normalize().mul(25.0));
        ctx.beginPath();
        ctx.moveTo(this.o.x, this.o.y);
        ctx.lineTo(line.x, line.y);
        ctx.stroke();
    }
    step(ctx, dt) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        let p = this.at(dt);
        // Line
        ctx.beginPath();
        ctx.moveTo(this.o.x, this.o.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        this.o = p;
    }
    stepWithGravity(ctx, dt) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        this.d.y += g * dt / 1;
        let p = this.at(dt);
        // Line
        ctx.beginPath();
        ctx.moveTo(this.o.x, this.o.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        this.o = p;
    }
    stepWithPlanets(ctx, dt, masses) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 2.0;
        let r = Infinity;
        let m = masses[0];
        for (let mass of masses) {
            let l = this.o.sub(mass.o).lenSq();
            if (l < r) {
                r = l;
                m = mass;
            }
        }
        r = Math.sqrt(r);
        // theta = 4GM / rc^2
        let theta = 4 * G * m.m / (r * this.d.lenSq());
        let toMass = new Vec2(m.o.x - this.o.x, m.o.y - this.o.y);
        if (toMass.lenSq() <= m.r * m.r) {
            return;
        }
        let newDir = this.d.rotate(theta);
        if (newDir.angleTo(toMass) > this.d.angleTo(toMass)) {
            newDir = this.d.rotate(-theta);
        }
        this.d = newDir;
        let p = this.at(dt);
        // Line
        ctx.beginPath();
        ctx.moveTo(Math.round(this.o.x), Math.round(this.o.y));
        ctx.lineTo(Math.round(p.x), Math.round(p.y));
        ctx.stroke();
        this.o = p;
    }
}
class Mass {
    constructor(m, o, r) {
        this.m = m;
        this.o = o;
        this.r = r;
    }
}
