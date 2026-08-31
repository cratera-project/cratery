---
id: conc-static-1
categorySlug: concurrency
title: "Spawn Lifetime"
difficulty: 2
tags: [concurrency, threads, lifetimes]
---

# Prompt
Why does capturing `s` by reference fail with `thread::spawn`?

# Code
```rust
use std::thread;

fn main() {
    let s = String::from("hi");
    let handle = thread::spawn(|| {
        println!("{s}");
    });
    handle.join().unwrap();
}
```

# Options
- [ ] A) `thread::spawn` forbids capturing any `String` values
- [ ] B) Threads may only capture data that lives on the heap
- [ ] C) The OS may relocate locals between cores at any time
- [x] D) The new thread may outlive this stack frame's locals

# Hint
Check the `'static` bound on `thread::spawn`'s closure.

# Explanation
`thread::spawn` requires `F: Send + 'static` because the thread can outlive the caller. Borrowing `s` would be a non-`'static` capture. Fix with `move`, owned data, or `thread::scope`.
