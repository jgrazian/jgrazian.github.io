/**
 * A two component vector class.
 */
export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Length of the vector
   */
  len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Length squared of the vector. Possibly faster than length.
   */
  lenSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Angle determined by Atan2(y, x)
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Angle needed to rotate this vector to lay on another vector.
   * @param other Vec2
   */
  angleTo(other: Vec2): number {
    return Math.acos(
      (this.x * other.x + this.y * other.y) / (this.len() * other.len()),
    );
  }

  /**
   * Rotate the vector by a given angle
   * @param a Angle in radians
   */
  rotate(a: number): Vec2 {
    let xp = Math.cos(a) * this.x - Math.sin(a) * this.y;
    let yp = Math.sin(a) * this.x + Math.cos(a) * this.y;
    return new Vec2(xp, yp);
  }

  /**
   * Make the vector's length 1 while maintining its direction.
   */
  normalize(): Vec2 {
    let l = this.len();
    if (l == 0) {
      return new Vec2(0, 0);
    }
    return new Vec2(this.x / l, this.y / l);
  }

  /**
   * Vector dot product. Returns a scalar.
   * @param other Vec2
   */
  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Vector addition
   * @param other Vec2
   */
  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  /**
   * Vector subtraction
   * @param other Vec2
   */
  sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  /**
   * Scalar multiplication
   * @param other Number
   */
  mul(other: number): Vec2 {
    return new Vec2(this.x * other, this.y * other);
  }

  /**
   * Scalar division
   * @param other Number
   */
  div(other: number): Vec2 {
    return new Vec2(this.x / other, this.y / other);
  }
}

/**
 * A matrix of Float32 with m rows and n columns
 */
export class Matrix {
  n: number; // Across
  m: number; // Down
  data: Float32Array;

  constructor(n: number, m: number) {
    this.n = n;
    this.m = m;
    this.data = new Float32Array(n * m);
  }

  static from(n: number, m: number, d: Iterable<number>) {
    let data = Float32Array.from(d);
    if (data.length != n*m) {
      throw `Given data length can not be made into matrix of size ${n}x${m}`;
    }
    let mat = new Matrix(n, m);
    mat.data = data;
    return mat;
  }

  /**
   * Get the value at the given i,j index
   * @param i Row (0->m-1)
   * @param j Column (0->n-1)
   */
  get(i: number, j: number): number {
    return this.data[i * this.m + j];
  }

  /**
   * Set the value at the given i,j matrix
   * @param i Row (0->m-1)
   * @param j Column (0->n-1)
   * @param v Number
   */
  set(i: number, j: number, v: number) {
    this.data[i * this.m + j] = v;
  }

  toString(): string {
    const numDigits = 4;
    let out = "";

    let maxLen = 0;
    for (const i in this.data) {
      let l = this.data[i].toFixed(numDigits).toString().length;
      if (l > maxLen) {
        maxLen = l;
      }
    }

    for (let i = 0; i < this.n; i++) {
      out += "|";
      for (let j = 0; j < this.m; j++) {
        out += `${this.get(i, j).toFixed(numDigits)} `.padStart(maxLen + 1, " ");
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

  swapRow(r0: number, r1: number) {
    let temp = [];
    for (let j=0; j < this.n; j++) {
      temp.push(this.get(r0, j));
      this.set(r0, j, this.get(r1, j));
    }
    for (let j=0; j < this.n; j++) {
      this.set(r1, j, temp[j]);
    }
  }

  /**
   * Mutates the matrix to put it into upper-triangular form using Gaussian Elimination
   * @param b b Vector to be augmented on A matrix
   */
  gaussianElimination(b: Vector) {
    let n = this.n;
    for (let j=0; j < n-1; j++) {

      console.log(j);
      let maxVal = Math.abs(this.get(j, j));
      let maxRow = j;
      for (let i=j+1; i < n; i++) {
        let curVal = Math.abs(this.get(i, j));
        if (curVal > maxVal) {
          maxVal = curVal;
          maxRow = i;
        }
      }
      if (maxVal < 0.00001) {
        console.log('Skip row')
        continue;
      }
      if (maxRow != j) {
        console.log(`Swapping ${j} and ${maxRow}`);
        this.swapRow(j, maxRow);
        b.swapRow(j, maxRow);
      }

      for (let i=j+1; i < n; i++) {
        let m = this.get(i, j)/this.get(j, j);
        for (let k=j; k < n; k++) {
          this.set(i, k, this.get(i, k) - m*this.get(j, k));
          console.log(this.toString());
        }
        b.set(i, b.get(i) - m*b.get(j));
      }
    }
  }

  /**
   * Solve for x using back substitution of a upper-triangular form augmented matrix
   * @param y The reduced augmented vector b
   */
  backSubstitution(y: Vector): Vector {
    let x = new Vector(this.n);
    for (let i=this.n-1; i >= 0; i--) {
      x.set(i, y.get(i));
      for (let j=i+1; j <= this.n-1; j++) {
        x.set(i, x.get(i) - this.get(i, j)*x.get(j));
      }
      x.set(i, x.get(i)/this.get(i, i));
    }
    return x;
  }

  /**
   * Solve Ax=b for x
   * @param b
   */
  solve(b: Vector): Vector {
    let bCopy = new Vector(b.n);
    bCopy.data = Float32Array.from(b.data);
    this.gaussianElimination(bCopy);
    console.log(this.toString());
    return this.backSubstitution(bCopy);
  }
}

export class Vector {
  n: number;
  data: Float32Array;

  constructor(n: number) {
    this.n = n;
    this.data = new Float32Array(n);
  }

  static from(d: Iterable<number>) {
    let data = Float32Array.from(d);
    let v = new Vector(data.length);
    v.data = data;
    return v;
  }

  /**
   * Get the value at the given i index
   * @param i Row (0->n-1)
   */
  get(i: number): number {
    return this.data[i];
  }

  /**
   * Set the value at the given i index
   * @param i Row (0->n-1)
   * @param v Number
   */
  set(i: number, v: number) {
    this.data[i] = v;
  }

  swapRow(r0: number, r1: number) {
    let temp = this.get(r0);
    this.set(r0, r1);
    this.set(r1, temp);
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
      out += "| ";
      out += `${this.get(i)} `.padStart(maxLen + 1, " ");
      out += "|\n";
    }
    return out;
  }
}

function test() {
  let data = [9, 3, 4,
              4, 3, 4,
              1, 1, 1
            ];
  let mat = Matrix.from(3, 3, data);

  let b = Vector.from([7, 8, 3]);

  console.log(mat.solve(b));
}
test();
