---
id: err-bail-pattern-1
categorySlug: error-handling
title: "Early Err Return"
difficulty: 2
tags: [error-handling, result]
---

# Prompt
Which pattern matches returning `Err` early without `?`?

# Code
```rust
fn check(n: i32) -> Result<(), String> {
    if n < 0 {
        return Err(String::from("negative"));
    }
    Ok(())
}
```

# Options
- [ ] A) `panic!` is required; `return Err` is not allowed
- [ ] B) Only `?` can produce an `Err` from a function body
- [x] C) You can `return Err(...)` like any early exit
- [ ] D) `Err` must be wrapped in `Ok` before returning it

# Hint
`?` is sugar; explicit `return Err` is fine.

# Explanation
A function returning `Result` can return `Err(...)` directly. `?` is convenient for propagating from callees, but validation branches often use an explicit early `return Err`.
