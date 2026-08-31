---
id: trait-drop-1
categorySlug: traits
title: "Drop Trait Limits"
difficulty: 2
tags: [traits, drop]
---

# Prompt
What is true about implementing `Drop`?

# Code
```rust
struct Guard;

impl Drop for Guard {
    fn drop(&mut self) {
        println!("bye");
    }
}
```

# Options
- [ ] A) You may call `Drop::drop` directly to run cleanup early
- [ ] B) `Drop` types can also implement `Copy` for cheap moves
- [x] C) The compiler invokes `drop` at the end of scope
- [ ] D) `drop` must be `async` to flush I/O before exiting

# Hint
Use `std::mem::drop` to drop early; don’t call the method.

# Explanation
`Drop::drop` runs automatically at end of scope (and via `mem::drop`). Calling `Drop::drop` yourself is disallowed. `Copy` and `Drop` are mutually exclusive.
