
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
*/
export class Circle {

    static __wrap(ptr) {
        const obj = Object.create(Circle.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_circle_free(ptr);
    }
    /**
    * @param {Vec2} center
    * @param {number} radius
    */
    constructor(center, radius) {
        _assertClass(center, Vec2);
        var ptr0 = center.ptr;
        center.ptr = 0;
        var ret = wasm.circle_new(ptr0, radius);
        return Circle.__wrap(ret);
    }
    /**
    * @returns {Vec2}
    */
    center() {
        var ret = wasm.circle_center(this.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    area() {
        var ret = wasm.circle_area(this.ptr);
        return ret;
    }
}
/**
* An nxm Matrix
*/
export class Matrix {

    static __wrap(ptr) {
        const obj = Object.create(Matrix.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_matrix_free(ptr);
    }
    /**
    * @returns {number}
    */
    get m() {
        var ret = wasm.__wbg_get_matrix_m(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set m(arg0) {
        wasm.__wbg_set_matrix_m(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get n() {
        var ret = wasm.__wbg_get_matrix_n(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set n(arg0) {
        wasm.__wbg_set_matrix_n(this.ptr, arg0);
    }
    /**
    * Create an empty matrix with m rows and n columns
    * @param {number} m
    * @param {number} n
    */
    constructor(m, n) {
        var ret = wasm.matrix_new(m, n);
        return Matrix.__wrap(ret);
    }
    /**
    * Create a matrix with m rows and n columns from data length m*n
    * @param {number} m
    * @param {number} n
    * @param {Float64Array} data
    * @returns {Matrix}
    */
    static from(m, n, data) {
        var ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.matrix_from(m, n, ptr0, len0);
        return Matrix.__wrap(ret);
    }
    /**
    * Get value at row i and column j
    * @param {number} i
    * @param {number} j
    * @returns {number}
    */
    get(i, j) {
        var ret = wasm.matrix_get(this.ptr, i, j);
        return ret;
    }
    /**
    * Set value at row i and colum j
    * @param {number} i
    * @param {number} j
    * @param {number} v
    */
    set(i, j, v) {
        wasm.matrix_set(this.ptr, i, j, v);
    }
    /**
    * Get matrix with select
    * @param {Uint32Array} r
    * @returns {Matrix}
    */
    get_rows(r) {
        var ptr0 = passArray32ToWasm0(r, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.matrix_get_rows(this.ptr, ptr0, len0);
        return Matrix.__wrap(ret);
    }
    /**
    * Get matrix with select columns
    * @param {Uint32Array} c
    * @returns {Matrix}
    */
    get_columns(c) {
        var ptr0 = passArray32ToWasm0(c, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.matrix_get_columns(this.ptr, ptr0, len0);
        return Matrix.__wrap(ret);
    }
    /**
    * Get matrix with select rows and columns
    * @param {Uint32Array} r
    * @param {Uint32Array} c
    * @returns {Matrix}
    */
    get_rows_columns(r, c) {
        var ptr0 = passArray32ToWasm0(r, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray32ToWasm0(c, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.matrix_get_rows_columns(this.ptr, ptr0, len0, ptr1, len1);
        return Matrix.__wrap(ret);
    }
    /**
    * @param {number} o
    * @param {number} p
    */
    swap_rows(o, p) {
        wasm.matrix_swap_rows(this.ptr, o, p);
    }
    /**
    * @param {number} o
    * @param {number} p
    */
    swap_columns(o, p) {
        wasm.matrix_swap_columns(this.ptr, o, p);
    }
    /**
    * @param {Matrix} other
    * @returns {Matrix}
    */
    add(other) {
        _assertClass(other, Matrix);
        var ret = wasm.matrix_add(this.ptr, other.ptr);
        return Matrix.__wrap(ret);
    }
    /**
    * @param {Matrix} other
    * @returns {Matrix}
    */
    sub(other) {
        _assertClass(other, Matrix);
        var ret = wasm.matrix_sub(this.ptr, other.ptr);
        return Matrix.__wrap(ret);
    }
    /**
    * @param {Vector} other
    * @returns {Vector}
    */
    mul_vec(other) {
        _assertClass(other, Vector);
        var ret = wasm.matrix_mul_vec(this.ptr, other.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Matrix} other
    * @returns {Matrix}
    */
    mul_mat(other) {
        _assertClass(other, Matrix);
        var ret = wasm.matrix_mul_mat(this.ptr, other.ptr);
        return Matrix.__wrap(ret);
    }
    /**
    * Solves Ax=b for x using Gaussian Elimination.
    * @param {Vector} b
    * @returns {Vector}
    */
    solve(b) {
        _assertClass(b, Vector);
        var ret = wasm.matrix_solve(this.ptr, b.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * Solves Ax=b for x using Gaussian Elimination. Mutates self and the given b vector.
    * @param {Vector} b
    * @returns {Vector}
    */
    solve_mut(b) {
        _assertClass(b, Vector);
        var ret = wasm.matrix_solve_mut(this.ptr, b.ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    to_string() {
        try {
            const retptr = wasm.__wbindgen_export_1.value - 16;
            wasm.__wbindgen_export_1.value = retptr;
            wasm.matrix_to_string(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_1.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* A 2d vector
*/
export class Vec2 {

    static __wrap(ptr) {
        const obj = Object.create(Vec2.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vec2_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        var ret = wasm.__wbg_get_vec2_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_vec2_x(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        var ret = wasm.__wbg_get_vec2_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_vec2_y(this.ptr, arg0);
    }
    /**
    * Creates a new Vec2
    * @param {number} x
    * @param {number} y
    */
    constructor(x, y) {
        var ret = wasm.vec2_new(x, y);
        return Vec2.__wrap(ret);
    }
    /**
    * Creates a new Vec2 with the same value for x and y
    * @param {number} v
    * @returns {Vec2}
    */
    static splat(v) {
        var ret = wasm.vec2_splat(v);
        return Vec2.__wrap(ret);
    }
    /**
    * Length^2
    * @returns {number}
    */
    len_sq() {
        var ret = wasm.vec2_len_sq(this.ptr);
        return ret;
    }
    /**
    * Length
    * @returns {number}
    */
    len() {
        var ret = wasm.vec2_len(this.ptr);
        return ret;
    }
    /**
    * Angle needed to rotate this vector to lay on another vector.
    * @param {Vec2} other
    * @returns {number}
    */
    angle_to(other) {
        _assertClass(other, Vec2);
        var ret = wasm.vec2_angle_to(this.ptr, other.ptr);
        return ret;
    }
    /**
    * Angle in radians
    * @returns {number}
    */
    angle() {
        var ret = wasm.vec2_angle(this.ptr);
        return ret;
    }
    /**
    * Rotate
    * @param {number} angle
    * @returns {Vec2}
    */
    rotate(angle) {
        var ret = wasm.vec2_rotate(this.ptr, angle);
        return Vec2.__wrap(ret);
    }
    /**
    * Normalize
    * @returns {Vec2}
    */
    normalize() {
        var ret = wasm.vec2_normalize(this.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {Vec2} v
    * @param {Vec2} w
    * @param {number} percent
    * @returns {Vec2}
    */
    static lerp(v, w, percent) {
        _assertClass(v, Vec2);
        _assertClass(w, Vec2);
        var ret = wasm.vec2_lerp(v.ptr, w.ptr, percent);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {Vec2} v
    * @param {Vec2} w
    * @returns {number}
    */
    static dot(v, w) {
        _assertClass(v, Vec2);
        _assertClass(w, Vec2);
        var ret = wasm.vec2_dot(v.ptr, w.ptr);
        return ret;
    }
    /**
    * @param {Vec2} v
    * @param {Vec2} w
    * @returns {number}
    */
    static cross(v, w) {
        _assertClass(v, Vec2);
        _assertClass(w, Vec2);
        var ret = wasm.vec2_cross(v.ptr, w.ptr);
        return ret;
    }
    /**
    * @param {Vec2} other
    * @returns {Vec2}
    */
    add(other) {
        _assertClass(other, Vec2);
        var ret = wasm.vec2_add(this.ptr, other.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {Vec2} other
    * @returns {Vec2}
    */
    sub(other) {
        _assertClass(other, Vec2);
        var ret = wasm.vec2_sub(this.ptr, other.ptr);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Vec2}
    */
    mul(other) {
        var ret = wasm.vec2_mul(this.ptr, other);
        return Vec2.__wrap(ret);
    }
    /**
    * @param {number} other
    * @returns {Vec2}
    */
    div(other) {
        var ret = wasm.vec2_div(this.ptr, other);
        return Vec2.__wrap(ret);
    }
}
/**
* An nth dimensional vector
*/
export class Vector {

    static __wrap(ptr) {
        const obj = Object.create(Vector.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vector_free(ptr);
    }
    /**
    * @returns {number}
    */
    get n() {
        var ret = wasm.__wbg_get_vector_n(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set n(arg0) {
        wasm.__wbg_set_vector_n(this.ptr, arg0);
    }
    /**
    * @param {number} n
    */
    constructor(n) {
        var ret = wasm.vector_new(n);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Float64Array} data
    * @returns {Vector}
    */
    static from(data) {
        var ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.vector_from(ptr0, len0);
        return Vector.__wrap(ret);
    }
    /**
    * @param {number} i
    * @returns {number}
    */
    get(i) {
        var ret = wasm.vector_get(this.ptr, i);
        return ret;
    }
    /**
    * @param {number} i
    * @param {number} v
    */
    set(i, v) {
        wasm.vector_set(this.ptr, i, v);
    }
    /**
    * @param {number} o
    * @param {number} p
    */
    swap(o, p) {
        wasm.vector_swap(this.ptr, o, p);
    }
    /**
    * @param {Vector} a
    * @param {Vector} b
    * @returns {number}
    */
    static dot(a, b) {
        _assertClass(a, Vector);
        _assertClass(b, Vector);
        var ret = wasm.vector_dot(a.ptr, b.ptr);
        return ret;
    }
    /**
    * @returns {string}
    */
    to_string() {
        try {
            const retptr = wasm.__wbindgen_export_1.value - 16;
            wasm.__wbindgen_export_1.value = retptr;
            wasm.vector_to_string(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_1.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

