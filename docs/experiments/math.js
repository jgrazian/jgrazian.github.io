/**
 * A two component vector class.
 */
export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Length of the vector
     */
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Length squared of the vector. Possibly faster than length.
     */
    lenSq() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * Angle determined by Atan2(y, x)
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }
    /**
     * Angle needed to rotate this vector to lay on another vector.
     * @param other Vec2
     */
    angleTo(other) {
        return Math.acos((this.x * other.x + this.y * other.y) / (this.len() * other.len()));
    }
    /**
     * Rotate the vector by a given angle
     * @param a Angle in radians
     */
    rotate(a) {
        let xp = Math.cos(a) * this.x - Math.sin(a) * this.y;
        let yp = Math.sin(a) * this.x + Math.cos(a) * this.y;
        return new Vec2(xp, yp);
    }
    /**
     * Make the vector's length 1 while maintining its direction.
     */
    normalize() {
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
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    /**
     * Vector addition
     * @param other Vec2
     */
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    /**
     * Vector subtraction
     * @param other Vec2
     */
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    /**
     * Scalar multiplication
     * @param other Number
     */
    mul(other) {
        return new Vec2(this.x * other, this.y * other);
    }
    /**
     * Scalar division
     * @param other Number
     */
    div(other) {
        return new Vec2(this.x / other, this.y / other);
    }
}
/**
 * A matrix of Float32 with m rows and n columns
 */
export class Matrix {
    constructor(n, m) {
        this.n = n;
        this.m = m;
        this.data = new Float32Array(n * m);
    }
    static from(n, m, d) {
        let data = Float32Array.from(d);
        if (data.length != n * m) {
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
    get(i, j) {
        return this.data[i * this.m + j];
    }
    /**
     * Set the value at the given i,j matrix
     * @param i Row (0->m-1)
     * @param j Column (0->n-1)
     * @param v Number
     */
    set(i, j, v) {
        this.data[i * this.m + j] = v;
    }
    toString() {
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
    swapRow(r0, r1) {
        let temp = [];
        for (let j = 0; j < this.n; j++) {
            temp.push(this.get(r0, j));
            this.set(r0, j, this.get(r1, j));
        }
        for (let j = 0; j < this.n; j++) {
            this.set(r1, j, temp[j]);
        }
    }
    /**
     * Mutates the matrix to put it into upper-triangular form using Gaussian Elimination
     * @param b b Vector to be augmented on A matrix
     */
    gaussianElimination(b) {
        let n = this.n;
        for (let j = 0; j < n - 1; j++) {
            console.log(j);
            let maxVal = Math.abs(this.get(j, j));
            let maxRow = j;
            for (let i = j + 1; i < n; i++) {
                let curVal = Math.abs(this.get(i, j));
                if (curVal > maxVal) {
                    maxVal = curVal;
                    maxRow = i;
                }
            }
            if (maxVal < 0.00001) {
                console.log('Skip row');
                continue;
            }
            if (maxRow != j) {
                console.log(`Swapping ${j} and ${maxRow}`);
                this.swapRow(j, maxRow);
                b.swapRow(j, maxRow);
            }
            for (let i = j + 1; i < n; i++) {
                let m = this.get(i, j) / this.get(j, j);
                for (let k = j; k < n; k++) {
                    this.set(i, k, this.get(i, k) - m * this.get(j, k));
                    console.log(this.toString());
                }
                b.set(i, b.get(i) - m * b.get(j));
            }
        }
    }
    /**
     * Solve for x using back substitution of a upper-triangular form augmented matrix
     * @param y The reduced augmented vector b
     */
    backSubstitution(y) {
        let x = new Vector(this.n);
        for (let i = this.n - 1; i >= 0; i--) {
            x.set(i, y.get(i));
            for (let j = i + 1; j <= this.n - 1; j++) {
                x.set(i, x.get(i) - this.get(i, j) * x.get(j));
            }
            x.set(i, x.get(i) / this.get(i, i));
        }
        return x;
    }
    /**
     * Solve Ax=b for x
     * @param b
     */
    solve(b) {
        let bCopy = new Vector(b.n);
        bCopy.data = Float32Array.from(b.data);
        this.gaussianElimination(bCopy);
        console.log(this.toString());
        return this.backSubstitution(bCopy);
    }
}
export class Vector {
    constructor(n) {
        this.n = n;
        this.data = new Float32Array(n);
    }
    static from(d) {
        let data = Float32Array.from(d);
        let v = new Vector(data.length);
        v.data = data;
        return v;
    }
    /**
     * Get the value at the given i index
     * @param i Row (0->n-1)
     */
    get(i) {
        return this.data[i];
    }
    /**
     * Set the value at the given i index
     * @param i Row (0->n-1)
     * @param v Number
     */
    set(i, v) {
        this.data[i] = v;
    }
    swapRow(r0, r1) {
        let temp = this.get(r0);
        this.set(r0, r1);
        this.set(r1, temp);
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
