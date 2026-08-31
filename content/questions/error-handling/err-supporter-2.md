---
id: err-supporter-2
categorySlug: error-handling
title: "Result::transpose Semantics"
difficulty: 2
tags: [error-handling, transpose, result]
---

# Prompt
What does `Result::transpose` convert `Result<Option<T>, E>` into?

# Code
```rust
fn main() {
    let r: Result<Option<i32>, &str> = Ok(Some(42));
    let t: Option<Result<i32, &str>> = r.transpose();
    assert_eq!(t, Some(Ok(42)));
}
```

# Options
- [ ] A) `Option<Result<T, E>>`
- [ ] B) `Result<Option<T>, E>`
- [x] C) `Option<Result<E, T>>`
- [ ] D) `Result<Option<E>, T>`

# Hint
transpose swaps the outer Result and inner Option layers.

# Explanation
`Result::transpose` turns `Result<Option<T>, E>` into `Option<Result<T, E>>`. `Ok(None)` becomes `None`, `Ok(Some(x))` becomes `Some(Ok(x))`, and `Err(e)` becomes `Some(Err(e))`.
