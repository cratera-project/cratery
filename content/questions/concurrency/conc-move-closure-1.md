---
id: conc-move-closure-1
categorySlug: concurrency
title: "Move Closures in Spawn"
difficulty: 2
tags: [concurrency, closures, move]
---

# Prompt
Why is `move` often required for `thread::spawn`?

# Code
```rust
use std::thread;
let name = String::from("worker");
thread::spawn(move || {
    println!("{name}");
}).join().unwrap();
```

# Options
- [ ] A) `move` makes the closure `Copy` so it can run twice
- [x] B) Spawned threads must own captures to outlive callers
- [ ] C) `move` is only a style hint and never changes captures
- [ ] D) `move` disables the borrow checker inside the closure

# Hint
The thread may outlive the spawning stack frame.

# Explanation
`thread::spawn` requires a `'static` closure. `move` forces captures by value so the thread owns what it needs instead of borrowing the caller’s stack. Scoped threads can borrow without `'static`.
