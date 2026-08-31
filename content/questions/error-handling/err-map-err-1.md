---
id: err-map-err-1
categorySlug: error-handling
title: "map_err"
difficulty: 2
tags: [error-handling, result, combinators]
---

# Prompt
What does `.map_err` change on a `Result`?

# Code
```rust
fn parse(s: &str) -> Result<i32, String> {
    s.parse::<i32>().map_err(|e| e.to_string())
}
```

# Options
- [ ] A) It transforms `Ok` values; `Err` values pass through
- [ ] B) It converts every `Result` into an `Option` instead
- [ ] C) It unwraps `Ok` and panics whenever `Err` appears
- [x] D) It transforms `Err` values; `Ok` values pass through

# Hint
Symmetric to `map`, but on the error side.

# Explanation
`map_err` applies a function to `Err(e)` and leaves `Ok(v)` unchanged, useful before `?` or when adapting error types. `map` adjusts the success side; `ok`/`err` convert to `Option`.
