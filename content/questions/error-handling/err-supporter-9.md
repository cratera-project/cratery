---
id: err-supporter-9
categorySlug: error-handling
title: "Result::map_err Usage"
difficulty: 2
tags: [error-handling, map-err, combinators]
---

# Prompt
When should `Result::map_err` be used?

# Code
```rust
fn parse_config(s: &str) -> Result<u32, String> {
    s.parse::<u32>().map_err(|e| format!("parse error: {e}"))
}
```

# Options
- [ ] A) To convert an `Ok` value into an `Err` value conditionally within local thread memory
- [x] B) To transform the error value `E` into `F` without modifying the `Ok` value
- [ ] C) To print the error message directly to the console stderr within local thread memory
- [ ] D) To catch stack unwinding panics inside the calling function in runtime memory

# Hint
map_err transforms the error value inside an Err without touching Ok.

# Explanation
`Result::map_err(f)` applies a closure `f: FnOnce(E) -> F` to transform the error value if the result is `Err(E)`, leaving `Ok(T)` untouched.
