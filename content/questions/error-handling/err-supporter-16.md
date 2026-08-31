---
id: err-supporter-16
categorySlug: error-handling
title: "Result Flatten Nested Result"
difficulty: 2
tags: [error-handling, flatten, result]
---

# Prompt
What does `Result::flatten` convert `Result<Result<T, E>, E>` into?

# Code
```rust
fn main() {
    let nested: Result<Result<i32, &str>, &str> = Ok(Ok(10));
    assert_eq!(nested.flatten(), Ok(10));
}
```

# Options
- [x] A) The flattened single result `Result<T, E>`
- [ ] B) The transposed nested type `Option<Result<T, E>>`
- [ ] C) The reversed nested type `Result<Option<T>, E>`
- [ ] D) The unwrapped plain option value `Option<T>`

# Hint
flatten collapses Result<Result<T, E>, E> into Result<T, E>.

# Explanation
`Result::flatten` collapses `Result<Result<T, E>, E>` into a single `Result<T, E>`. If the outer is `Err(e)` or the inner is `Err(e)`, it returns `Err(e)`.
