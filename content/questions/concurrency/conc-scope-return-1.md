---
id: conc-scope-return-1
categorySlug: concurrency
title: "Scoped Return Values"
difficulty: 3
tags: [concurrency, threads, lifetimes]
---

# Prompt
Why can the scoped thread return a borrow of `s`?

# Code
```rust
use std::thread;

fn main() {
    let s = String::from("hello");
    thread::scope(|scope| {
        let h = scope.spawn(|| &s[0..1]);
        let first: &str = h.join().unwrap();
        println!("{first}");
    });
}
```

# Options
- [ ] A) Every `&str` is implicitly `'static` in return position
- [x] B) The scope joins the thread before `s` can be dropped
- [ ] C) `spawn` always erases borrow checking for closures
- [ ] D) `String` is `Copy`, so the slice outlives freely

# Hint
Scoped joins make the borrow's lifetime finite and known.

# Explanation
Scoped threads cannot outlive the `thread::scope` call, so a reference into `s` remains valid until `join` returns inside the scope. Plain `thread::spawn` would require `'static` and reject this borrow.
