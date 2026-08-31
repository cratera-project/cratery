---
id: conc-scope-1
categorySlug: concurrency
title: "Scoped Threads"
difficulty: 2
tags: [concurrency, threads]
---

# Prompt
What problem does `std::thread::scope` solve here?

# Code
```rust
use std::thread;

fn main() {
    let s = String::from("hello");
    thread::scope(|scope| {
        scope.spawn(|| {
            println!("{}", s.len());
        });
    });
}
```

# Options
- [ ] A) It makes every mutex acquire locks in FIFO order
- [ ] B) It forces a fixed run order among spawned threads
- [x] C) It lets threads borrow locals; they join before exit
- [ ] D) It replaces the OS scheduler with a Rust runtime

# Hint
Compare the lifetime bound on `scope.spawn` with `thread::spawn`.

# Explanation
Scoped threads are joined before `thread::scope` returns, so borrowing parent-stack data is safe. They do not guarantee scheduling order or fairness of locks.
