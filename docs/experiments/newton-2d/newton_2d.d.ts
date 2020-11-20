/* tslint:disable */
/* eslint-disable */
/**
*/
export class Circle {
  free(): void;
/**
* @param {Vec2} center
* @param {number} radius
*/
  constructor(center: Vec2, radius: number);
/**
* @returns {Vec2}
*/
  center(): Vec2;
/**
* @returns {number}
*/
  area(): number;
}
/**
* An nxm Matrix
*/
export class Matrix {
  free(): void;
/**
* Create an empty matrix with m rows and n columns
* @param {number} m
* @param {number} n
*/
  constructor(m: number, n: number);
/**
* Create a matrix with m rows and n columns from data length m*n
* @param {number} m
* @param {number} n
* @param {Float64Array} data
* @returns {Matrix}
*/
  static from(m: number, n: number, data: Float64Array): Matrix;
/**
* Get value at row i and column j
* @param {number} i
* @param {number} j
* @returns {number}
*/
  get(i: number, j: number): number;
/**
* Set value at row i and colum j
* @param {number} i
* @param {number} j
* @param {number} v
*/
  set(i: number, j: number, v: number): void;
/**
* Get matrix with select
* @param {Uint32Array} r
* @returns {Matrix}
*/
  get_rows(r: Uint32Array): Matrix;
/**
* Get matrix with select columns
* @param {Uint32Array} c
* @returns {Matrix}
*/
  get_columns(c: Uint32Array): Matrix;
/**
* Get matrix with select rows and columns
* @param {Uint32Array} r
* @param {Uint32Array} c
* @returns {Matrix}
*/
  get_rows_columns(r: Uint32Array, c: Uint32Array): Matrix;
/**
* @param {number} o
* @param {number} p
*/
  swap_rows(o: number, p: number): void;
/**
* @param {number} o
* @param {number} p
*/
  swap_columns(o: number, p: number): void;
/**
* @param {Matrix} other
* @returns {Matrix}
*/
  add(other: Matrix): Matrix;
/**
* @param {Matrix} other
* @returns {Matrix}
*/
  sub(other: Matrix): Matrix;
/**
* @param {Vector} other
* @returns {Vector}
*/
  mul_vec(other: Vector): Vector;
/**
* @param {Matrix} other
* @returns {Matrix}
*/
  mul_mat(other: Matrix): Matrix;
/**
* Solves Ax=b for x using Gaussian Elimination.
* @param {Vector} b
* @returns {Vector}
*/
  solve(b: Vector): Vector;
/**
* Solves Ax=b for x using Gaussian Elimination. Mutates self and the given b vector.
* @param {Vector} b
* @returns {Vector}
*/
  solve_mut(b: Vector): Vector;
/**
* @returns {string}
*/
  to_string(): string;
/**
* @returns {number}
*/
  m: number;
/**
* @returns {number}
*/
  n: number;
}
/**
* A 2d vector
*/
export class Vec2 {
  free(): void;
/**
* Creates a new Vec2
* @param {number} x
* @param {number} y
*/
  constructor(x: number, y: number);
/**
* Creates a new Vec2 with the same value for x and y
* @param {number} v
* @returns {Vec2}
*/
  static splat(v: number): Vec2;
/**
* Length^2
* @returns {number}
*/
  len_sq(): number;
/**
* Length
* @returns {number}
*/
  len(): number;
/**
* Angle needed to rotate this vector to lay on another vector.
* @param {Vec2} other
* @returns {number}
*/
  angle_to(other: Vec2): number;
/**
* Angle in radians
* @returns {number}
*/
  angle(): number;
/**
* Rotate
* @param {number} angle
* @returns {Vec2}
*/
  rotate(angle: number): Vec2;
/**
* Normalize
* @returns {Vec2}
*/
  normalize(): Vec2;
/**
* @param {Vec2} v
* @param {Vec2} w
* @param {number} percent
* @returns {Vec2}
*/
  static lerp(v: Vec2, w: Vec2, percent: number): Vec2;
/**
* @param {Vec2} v
* @param {Vec2} w
* @returns {number}
*/
  static dot(v: Vec2, w: Vec2): number;
/**
* @param {Vec2} v
* @param {Vec2} w
* @returns {number}
*/
  static cross(v: Vec2, w: Vec2): number;
/**
* @param {Vec2} other
* @returns {Vec2}
*/
  add(other: Vec2): Vec2;
/**
* @param {Vec2} other
* @returns {Vec2}
*/
  sub(other: Vec2): Vec2;
/**
* @param {number} other
* @returns {Vec2}
*/
  mul(other: number): Vec2;
/**
* @param {number} other
* @returns {Vec2}
*/
  div(other: number): Vec2;
/**
* @returns {number}
*/
  x: number;
/**
* @returns {number}
*/
  y: number;
}
/**
* An nth dimensional vector
*/
export class Vector {
  free(): void;
/**
* @param {number} n
*/
  constructor(n: number);
/**
* @param {Float64Array} data
* @returns {Vector}
*/
  static from(data: Float64Array): Vector;
/**
* @param {number} i
* @returns {number}
*/
  get(i: number): number;
/**
* @param {number} i
* @param {number} v
*/
  set(i: number, v: number): void;
/**
* @param {number} o
* @param {number} p
*/
  swap(o: number, p: number): void;
/**
* @param {Vector} a
* @param {Vector} b
* @returns {number}
*/
  static dot(a: Vector, b: Vector): number;
/**
* @returns {string}
*/
  to_string(): string;
/**
* @returns {number}
*/
  n: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_matrix_free: (a: number) => void;
  readonly __wbg_get_matrix_m: (a: number) => number;
  readonly __wbg_set_matrix_m: (a: number, b: number) => void;
  readonly __wbg_get_matrix_n: (a: number) => number;
  readonly __wbg_set_matrix_n: (a: number, b: number) => void;
  readonly matrix_new: (a: number, b: number) => number;
  readonly matrix_from: (a: number, b: number, c: number, d: number) => number;
  readonly matrix_get: (a: number, b: number, c: number) => number;
  readonly matrix_set: (a: number, b: number, c: number, d: number) => void;
  readonly matrix_get_rows: (a: number, b: number, c: number) => number;
  readonly matrix_get_columns: (a: number, b: number, c: number) => number;
  readonly matrix_get_rows_columns: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly matrix_swap_rows: (a: number, b: number, c: number) => void;
  readonly matrix_swap_columns: (a: number, b: number, c: number) => void;
  readonly matrix_add: (a: number, b: number) => number;
  readonly matrix_sub: (a: number, b: number) => number;
  readonly matrix_mul_vec: (a: number, b: number) => number;
  readonly matrix_mul_mat: (a: number, b: number) => number;
  readonly matrix_solve: (a: number, b: number) => number;
  readonly matrix_solve_mut: (a: number, b: number) => number;
  readonly matrix_to_string: (a: number, b: number) => void;
  readonly __wbg_vector_free: (a: number) => void;
  readonly __wbg_get_vector_n: (a: number) => number;
  readonly __wbg_set_vector_n: (a: number, b: number) => void;
  readonly vector_new: (a: number) => number;
  readonly vector_from: (a: number, b: number) => number;
  readonly vector_get: (a: number, b: number) => number;
  readonly vector_set: (a: number, b: number, c: number) => void;
  readonly vector_swap: (a: number, b: number, c: number) => void;
  readonly vector_dot: (a: number, b: number) => number;
  readonly vector_to_string: (a: number, b: number) => void;
  readonly __wbg_vec2_free: (a: number) => void;
  readonly __wbg_get_vec2_x: (a: number) => number;
  readonly __wbg_set_vec2_x: (a: number, b: number) => void;
  readonly __wbg_get_vec2_y: (a: number) => number;
  readonly __wbg_set_vec2_y: (a: number, b: number) => void;
  readonly vec2_new: (a: number, b: number) => number;
  readonly vec2_splat: (a: number) => number;
  readonly vec2_len_sq: (a: number) => number;
  readonly vec2_len: (a: number) => number;
  readonly vec2_angle_to: (a: number, b: number) => number;
  readonly vec2_angle: (a: number) => number;
  readonly vec2_rotate: (a: number, b: number) => number;
  readonly vec2_normalize: (a: number) => number;
  readonly vec2_lerp: (a: number, b: number, c: number) => number;
  readonly vec2_dot: (a: number, b: number) => number;
  readonly vec2_cross: (a: number, b: number) => number;
  readonly vec2_add: (a: number, b: number) => number;
  readonly vec2_sub: (a: number, b: number) => number;
  readonly vec2_mul: (a: number, b: number) => number;
  readonly vec2_div: (a: number, b: number) => number;
  readonly __wbg_circle_free: (a: number) => void;
  readonly circle_new: (a: number, b: number) => number;
  readonly circle_center: (a: number) => number;
  readonly circle_area: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        