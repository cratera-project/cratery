---
id: own-copy-1
categorySlug: ownership
title: "Copy Trait Semantics"
difficulty: 1
tags: [ownership, copy]
---

# Prompt
Why is `x` still valid after being assigned to `y`?

# Code
```rust
fn main() {
    let x = 5;
    let y = x;
    println!("x = {}, y = {}", x, y);
}
```

# Options
- [x] A) `i32` implements `Copy`, so assign duplicates it
- [ ] B) All numeric types use shared reference semantics
- [ ] C) Rust always clones values smaller than a pointer
- [ ] D) Assignment creates shared ownership of the value

# Hint
Stack-only scalars often implement a special trait.

# Explanation
`i32` implements `Copy`. Assignment bitwise-copies the value, so `x` and `y` are independent. Types with heap ownership (like `String`) do not implement `Copy` and move instead.
