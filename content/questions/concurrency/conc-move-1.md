---
id: conc-move-1
categorySlug: concurrency
title: "Move Closures"
difficulty: 2
tags: [concurrency, closures]
---

# Prompt
Why does this spawn use a `move` closure?

# Code
```rust
use std::thread;

fn main() {
    let v = vec![1, 2];
    thread::spawn(move || {
        println!("{:?}", v);
    })
    .join()
    .unwrap();
}
```

# Options
- [ ] A) So the closure borrows `v` for the new thread
- [x] B) So ownership of `v` moves into the new thread
- [ ] C) So `v` becomes mutable inside the new thread
- [ ] D) So the compiler places `v` in thread-local storage

# Hint
`thread::spawn` requires a `'static` closure; stack borrows usually will not do.

# Explanation
`std::thread::spawn` needs `Send + 'static`. A borrow of `v` would not outlive the caller safely. `move` transfers ownership of `v` into the closure so the new thread owns the data.
