export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lenSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  angleTo(other: Vec2): number {
    return Math.acos(
      (this.x * other.x + this.y * other.y) / (this.len() * other.len()),
    );
  }

  rotate(a: number): Vec2 {
    let xp = Math.cos(a) * this.x - Math.sin(a) * this.y;
    let yp = Math.sin(a) * this.x + Math.cos(a) * this.y;
    return new Vec2(xp, yp);
  }

  unit(): Vec2 {
    let l = this.len();
    if (l == 0) {
      return new Vec2(0, 0);
    }
    return new Vec2(this.x / l, this.y / l);
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  mul(other: number): Vec2 {
    return new Vec2(this.x * other, this.y * other);
  }

  div(other: number): Vec2 {
    return new Vec2(this.x * other, this.y * other);
  }
}

export class Matrix {
  n: number; // Across
  m: number; // Down
  data: Float32Array;

  constructor(n: number, m: number) {
    this.n = n;
    this.m = m;
    this.data = new Float32Array(n * m);
  }

  get(i: number, j: number): number {
    return this.data[i * this.m + j];
  }

  set(i: number, j: number, v: number) {
    this.data[i * this.m + j] = v;
  }

  toString(): string {
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

  static randomLowerMatrix(n: number): Matrix {
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
}
