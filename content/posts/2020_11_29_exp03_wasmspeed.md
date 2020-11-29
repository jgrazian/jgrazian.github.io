---
title: "Experiment #3: Testing WASM Speed"
date: 2020-11-29 13:42:00
description: Web Assembly Speed Test
type: experiment
script: /experiments/wasm-test.js
tags:
    - experiments
katex: false
---

My previous experiment posts use a little Math/Geometry engine I wrote in Rust and compiled to Web-Assembly that I call 'Newton-2d'. In my [truss solver](/posts/2020_11_16_exp02_truss) uses the WASM engine to solve the matrix problem discussed in the post by using Gaussian Elimination. Naive Gaussian Elimination is an O(n^3) algorithm so it quickly becomes quite unruly at larger matrix sizes so I figured that WASM would speed things up a bit. I decied to actually test this hypothesis here where I run the same GE algorithm in Javascript and WASM.

Needless to say the results are... disappointing. WASM seems to be slower than Javascript for every n my poor labtop will even run. My best guess for this result is that the time it takes to copy data to and from WASM overshadows the performance gain from using WASM itself. Perhaps at larger n values WASM becomes more worthwhile but at those matrix sizes GE becomes unbearably slow on just about any single thread... So ¯\\_(ツ)_/¯ WASM is cool anyway.

Here is the Gaussian Elimination algorithm in Rust:
```rust
fn gaussian_elimination(&mut self, b: &mut Vector) {
    for i in 0..(self.n-1) { // Rows

        // Partial Pivot
        let mut max_val = self[[i, i]].abs();
        let mut max_idx = i;
        for ii in (i+1)..self.n {
            if self[[ii, i]].abs() > max_val {
                max_val = self[[ii, i]].abs();
                max_idx = ii;
            }
        }
        if max_idx != i {
            self.swap_rows(i, max_idx);
            b.swap(i, max_idx);
        }

        // Reduce
        for j in (i+1)..self.n {
            let m = self[[j, i]] / self[[i, i]]; 
            for k in i..self.n {
                self[[j, k]] -= m * self[[i, k]];
            }
            b[j] -= m * b[i];
        }
    }
}
```