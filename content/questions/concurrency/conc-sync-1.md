---
id: conc-sync-1
categorySlug: concurrency
title: "Sync and Sharing"
difficulty: 3
tags: [concurrency, threads, sync]
---

# Prompt
Why can both scoped threads borrow `data` without `Arc`?

# Code
```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3];
    thread::scope(|s| {
        s.spawn(|| println!("{}", data.len()));
        s.spawn(|| println!("{}", data[0]));
    });
}
```

# Options
- [x] A) Scoped threads join before exit, and `Vec<i32>` is `Sync`
- [ ] B) `println!` serializes access so borrows never overlap
- [ ] C) `Vec<i32>` is `Copy`, so each thread gets its own copy
- [ ] D) Scoped threads always run one after another, never together

# Hint
Two ingredients: lifetime of the threads, and whether `&T` may cross threads.

# Explanation
`thread::scope` joins all spawned threads before returning, so borrows of stack data are sound. Sharing `&Vec<i32>` across threads also requires `Vec<i32>: Sync`, which holds for `i32`.
