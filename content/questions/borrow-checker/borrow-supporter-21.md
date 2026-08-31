---
id: borrow-supporter-21
categorySlug: borrow-checker
title: "Borrow Checker and Thread Boundary Crossings"
difficulty: 2
tags: [borrow-checker, threads, static-bound]
---

# Prompt
Why cannot a standard reference `&'a str` be captured by `std::thread::spawn(move || ...)`?

# Code
```rust
fn spawn_thread(s: &str) {
    // std::thread::spawn(move || println!("{s}")); // compile error
}
```

# Options
- [ ] A) Strings cannot be shared across OS threads under any circumstance in runtime memory
- [ ] B) The borrow checker only permits passing integers to thread closures in runtime memory
- [x] C) `thread::spawn` requires the closure and captured types to satisfy `'static`
- [ ] D) Thread spawning requires the unsafe keyword in modern editions in runtime memory

# Hint
thread::spawn requires F: 'static because the spawned thread could outlive the caller stack.

# Explanation
`std::thread::spawn` requires `F: 'static` because the spawned thread can execute for an arbitrary duration and might outlive the stack frame where `s` resides. Use `thread::scope` for non-`'static` borrows.
