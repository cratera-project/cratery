---
id: err-supporter-8
categorySlug: error-handling
title: "Result::and_then for Chaining"
difficulty: 2
tags: [error-handling, and-then, combinators]
---

# Prompt
What closure signature is required by `res.and_then(f)` on `Result<T, E>`?

# Code
```rust
fn main() {
    let r: Result<i32, &str> = Ok(10);
    let next = r.and_then(|x| if x > 5 { Ok(x * 2) } else { Err("too small") });
    assert_eq!(next, Ok(20));
}
```

# Options
- [x] A) `FnOnce(T) -> Result<U, E>`
- [ ] B) `FnOnce(T) -> Result<T, E>`
- [ ] C) `FnOnce(E) -> Result<T, F>`
- [ ] D) `FnOnce(E) -> Result<U, E>`

# Hint
and_then (flat_map) chains fallible operations that themselves return a Result.

# Explanation
`Result::and_then` calls a closure that takes the `Ok` value `T` and returns a new `Result<U, E>`, propagating errors if the original was `Err` or if the closure returns `Err`.
