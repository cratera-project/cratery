---
id: err-and-then-1
categorySlug: error-handling
title: "and_then Chaining"
difficulty: 2
tags: [error-handling, result, combinators]
---

# Prompt
What does `.and_then` do that `.map` does not?

# Code
```rust
fn parse_then_double(s: &str) -> Result<i32, ParseIntError> {
    s.parse::<i32>().and_then(|n| Ok(n * 2))
}
```

# Options
- [ ] A) It panics on `Err` instead of transforming `Ok`
- [x] B) The closure returns a `Result`, then flattens it
- [ ] C) It only runs when the value is already an `Err`
- [ ] D) It converts every `Result` into a plain `Option`

# Hint
Think “flatMap” for `Result`/`Option`.

# Explanation
`map` wraps the closure’s return in `Ok`/`Some`. `and_then` expects the closure to return a `Result`/`Option` and flattens, so you avoid `Result<Result<_,_>,_>`. Errors short-circuit without calling the closure.
