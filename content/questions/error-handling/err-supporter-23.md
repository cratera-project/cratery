---
id: err-supporter-23
categorySlug: error-handling
title: "Result::into_ok and into_err for Infallible"
difficulty: 3
tags: [error-handling, infallible, into-ok]
---

# Prompt
When is `res.into_ok()` available on `Result<T, E>`?

# Code
```rust
use std::convert::Infallible;

fn extract(res: Result<i32, Infallible>) -> i32 {
    match res {
        Ok(v) => v,
        Err(infallible) => match infallible {},
    }
}
```

# Options
- [ ] A) Whenever `T` implements the `Copy` marker trait during runtime execution in runtime memory
- [ ] B) Only when compiled under release optimization mode under current compiler safety rules
- [ ] C) When the result is wrapped inside an atomic container under current compiler safety rules
- [x] D) When `E` is `Infallible` (or never type `!`), guaranteeing infallible extraction

# Hint
into_ok safely unwraps without panicking when the error type is Infallible.

# Explanation
`Result::into_ok` is implemented for `Result<T, Infallible>` (and `Result<T, !>`). Because the error variant can never exist, `into_ok()` extracts `T` safely without panicking or branch checks.
