---
id: own-drop-1
categorySlug: ownership
title: "Drop Timing"
difficulty: 1
tags: [ownership, drop]
---

# Prompt
When is `s`’s heap buffer freed?

# Code
```rust
fn main() {
    let s = String::from("hello");
    println!("{s}");
} // <-- here?
```

# Options
- [ ] A) Immediately after `String::from` finishes
- [ ] B) Only if you call `drop(s)` yourself explicitly
- [ ] C) At process exit via a global garbage collector
- [x] D) When `main` returns and `s` goes out of scope

# Hint
Rust frees owned values deterministically.

# Explanation
Ownership implies a single owner that runs `Drop` when the binding goes out of scope. For `String`, that frees the heap buffer at the end of `main` (unless moved earlier). There is no GC; `drop(s)` only forces an earlier drop.
