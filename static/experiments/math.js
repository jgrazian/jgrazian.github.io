/**
 * A two component vector class.
 */
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Length of the vector
     */
    Vec2.prototype.len = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    /**
     * Length squared of the vector. Possibly faster than length.
     */
    Vec2.prototype.lenSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    /**
     * Angle determined by Atan2(y, x)
     */
    Vec2.prototype.angle = function () {
        return Math.atan2(this.y, this.x);
    };
    /**
     * Angle needed to rotate this vector to lay on another vector.
     * @param other Vec2
     */
    Vec2.prototype.angleTo = function (other) {
        return Math.acos((this.x * other.x + this.y * other.y) / (this.len() * other.len()));
    };
    /**
     * Rotate the vector by a given angle
     * @param a Angle in radians
     */
    Vec2.prototype.rotate = function (a) {
        var xp = Math.cos(a) * this.x - Math.sin(a) * this.y;
        var yp = Math.sin(a) * this.x + Math.cos(a) * this.y;
        return new Vec2(xp, yp);
    };
    /**
     * Make the vector's length 1 while maintining its direction.
     */
    Vec2.prototype.normalize = function () {
        var l = this.len();
        if (l == 0) {
            return new Vec2(0, 0);
        }
        return new Vec2(this.x / l, this.y / l);
    };
    /**
     * Vector dot product. Returns a scalar.
     * @param other Vec2
     */
    Vec2.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    /**
     * Vector addition
     * @param other Vec2
     */
    Vec2.prototype.add = function (other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    };
    /**
     * Vector subtraction
     * @param other Vec2
     */
    Vec2.prototype.sub = function (other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    };
    /**
     * Scalar multiplication
     * @param other Number
     */
    Vec2.prototype.mul = function (other) {
        return new Vec2(this.x * other, this.y * other);
    };
    /**
     * Scalar division
     * @param other Number
     */
    Vec2.prototype.div = function (other) {
        return new Vec2(this.x / other, this.y / other);
    };
    return Vec2;
}());
export { Vec2 };
/**
 * A matrix of Float32 with m rows and n columns
 */
var Matrix = /** @class */ (function () {
    function Matrix(n, m) {
        this.n = n;
        this.m = m;
        this.data = new Float32Array(n * m);
    }
    Matrix.from = function (n, m, d) {
        var data = Float32Array.from(d);
        if (data.length != n * m) {
            throw "Given data length can not be made into matrix of size " + n + "x" + m;
        }
        var mat = new Matrix(n, m);
        mat.data = data;
        return mat;
    };
    /**
     * Get the value at the given i,j index
     * @param i Row (0->m-1)
     * @param j Column (0->n-1)
     */
    Matrix.prototype.get = function (i, j) {
        return this.data[i * this.m + j];
    };
    /**
     * Set the value at the given i,j matrix
     * @param i Row (0->m-1)
     * @param j Column (0->n-1)
     * @param v Number
     */
    Matrix.prototype.set = function (i, j, v) {
        this.data[i * this.m + j] = v;
    };
    Matrix.prototype.toString = function () {
        var numDigits = 4;
        var out = "";
        var maxLen = 0;
        for (var i in this.data) {
            var l = this.data[i].toFixed(numDigits).toString().length;
            if (l > maxLen) {
                maxLen = l;
            }
        }
        for (var i = 0; i < this.n; i++) {
            out += "|";
            for (var j = 0; j < this.m; j++) {
                out += (this.get(i, j).toFixed(numDigits) + " ").padStart(maxLen + 1, " ");
            }
            out += "|\n";
        }
        return out;
    };
    Matrix.randomLowerMatrix = function (n) {
        var mat = new Matrix(n, n);
        for (var i = 0; i < n; i++) {
            for (var j = 0; j <= i; j++) {
                if (Math.random() < 0.35) {
                    mat.set(i, j, Math.round(Math.random() * 10));
                }
            }
        }
        return mat;
    };
    Matrix.prototype.swapRow = function (r0, r1) {
        var temp = [];
        for (var j = 0; j < this.n; j++) {
            temp.push(this.get(r0, j));
            this.set(r0, j, this.get(r1, j));
        }
        for (var j = 0; j < this.n; j++) {
            this.set(r1, j, temp[j]);
        }
    };
    /**
     * Mutates the matrix to put it into upper-triangular form using Gaussian Elimination
     * @param b b Vector to be augmented on A matrix
     */
    Matrix.prototype.gaussianElimination = function (b) {
        var n = this.n;
        for (var j = 0; j < n - 1; j++) {
            console.log(j);
            var maxVal = Math.abs(this.get(j, j));
            var maxRow = j;
            for (var i = j + 1; i < n; i++) {
                var curVal = Math.abs(this.get(i, j));
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
                console.log("Swapping " + j + " and " + maxRow);
                this.swapRow(j, maxRow);
                b.swapRow(j, maxRow);
            }
            for (var i = j + 1; i < n; i++) {
                var m = this.get(i, j) / this.get(j, j);
                for (var k = j; k < n; k++) {
                    this.set(i, k, this.get(i, k) - m * this.get(j, k));
                    console.log(this.toString());
                }
                b.set(i, b.get(i) - m * b.get(j));
            }
        }
    };
    /**
     * Solve for x using back substitution of a upper-triangular form augmented matrix
     * @param y The reduced augmented vector b
     */
    Matrix.prototype.backSubstitution = function (y) {
        var x = new Vector(this.n);
        for (var i = this.n - 1; i >= 0; i--) {
            x.set(i, y.get(i));
            for (var j = i + 1; j <= this.n - 1; j++) {
                x.set(i, x.get(i) - this.get(i, j) * x.get(j));
            }
            x.set(i, x.get(i) / this.get(i, i));
        }
        return x;
    };
    /**
     * Solve Ax=b for x
     * @param b
     */
    Matrix.prototype.solve = function (b) {
        var bCopy = new Vector(b.n);
        bCopy.data = Float32Array.from(b.data);
        this.gaussianElimination(bCopy);
        console.log(this.toString());
        return this.backSubstitution(bCopy);
    };
    return Matrix;
}());
export { Matrix };
var Vector = /** @class */ (function () {
    function Vector(n) {
        this.n = n;
        this.data = new Float32Array(n);
    }
    Vector.from = function (d) {
        var data = Float32Array.from(d);
        var v = new Vector(data.length);
        v.data = data;
        return v;
    };
    /**
     * Get the value at the given i index
     * @param i Row (0->n-1)
     */
    Vector.prototype.get = function (i) {
        return this.data[i];
    };
    /**
     * Set the value at the given i index
     * @param i Row (0->n-1)
     * @param v Number
     */
    Vector.prototype.set = function (i, v) {
        this.data[i] = v;
    };
    Vector.prototype.swapRow = function (r0, r1) {
        var temp = this.get(r0);
        this.set(r0, r1);
        this.set(r1, temp);
    };
    Vector.prototype.toString = function () {
        var out = "";
        var maxLen = 0;
        for (var i in this.data) {
            var l = this.data[i].toString().length;
            if (l > maxLen) {
                maxLen = l;
            }
        }
        for (var i = 0; i < this.n; i++) {
            out += "| ";
            out += (this.get(i) + " ").padStart(maxLen + 1, " ");
            out += "|\n";
        }
        return out;
    };
    return Vector;
}());
export { Vector };
function test() {
    var data = [9, 3, 4,
        4, 3, 4,
        1, 1, 1
    ];
    var mat = Matrix.from(3, 3, data);
    var b = Vector.from([7, 8, 3]);
    console.log(mat.solve(b));
}
test();
