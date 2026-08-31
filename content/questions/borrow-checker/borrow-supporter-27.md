---
id: borrow-supporter-27
categorySlug: borrow-checker
title: "Match Ergonomics on Tuples of References"
difficulty: 2
tags: [borrow-checker, match-ergonomics, tuples]
---

# Prompt
What happens when matching `(&x, &y)` in `match (&x, &y) { (&a, &b) => ... }`?

# Code
```rust
fn main() {
    let x = 10;
    let y = 20;
    match (&x, &y) {
        (&a, &b) => println!("{a} {b}"),
    }
}
```

# Options
- [x] A) `a` and `b` are bound as copied `i32` values by dereferencing patterns
- [ ] B) `a` and `b` are bound as double references `&&i32` within local thread memory
- [ ] C) Causes a compiler error because tuples cannot hold references in runtime memory
- [ ] D) `x` and `y` are moved out of their local stack frames within local thread memory

# Hint
Matching &a against a reference &i32 strips the reference and binds a to i32.

# Explanation
The pattern `&a` matches against the reference `&x: &i32`, unwrapping the reference layer and binding `a` directly to the `i32` value (copying the integer).
