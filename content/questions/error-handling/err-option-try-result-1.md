---
id: err-option-try-result-1
categorySlug: error-handling
title: "Option ? in Result"
difficulty: 2
tags: [error-handling, question-operator, option]
---

# Prompt
Why does `Ok(x?)` fail to compile?

# Code
```rust
fn f() -> Result<i32, &'static str> {
    let x: Option<i32> = Some(1);
    Ok(x?)
}
```

# Options
- [x] A) `?` on `Option` fails in a `Result` function
- [ ] B) `Some(1)` must be unwrapped before any `Ok`
- [ ] C) `'static str` cannot be an error type with `?`
- [ ] D) `?` is allowed only in functions named `try_`

# Hint
`?` follows the function’s `Try` residual type.

# Explanation
`?` uses the `Try` trait. In a `Result`-returning function it expects a `Result` (or another type whose residual converts). An `Option` residual does not convert to `Result<_, &str>`, so the compiler rejects `x?`. Convert first (`x.ok_or("missing")?`) or return `Option` from `f`.
