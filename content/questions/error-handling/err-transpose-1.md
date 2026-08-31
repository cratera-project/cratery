---
id: err-transpose-1
categorySlug: error-handling
title: "Transposing Nested Results"
difficulty: 2
tags: [error-handling, option, result]
---

# Prompt
What does `transpose` do on `Option<Result<T, E>>`?

# Code
```rust
let nested: Option<Result<i32, &str>> = Some(Ok(1));
let flipped: Result<Option<i32>, &str> = nested.transpose();
```

# Options
- [ ] A) It unwraps both layers and always yields a bare `T`
- [ ] B) It discards `Err` and keeps only the `Option` shell
- [x] C) It swaps the layers: `Result` outside, `Option` in
- [ ] D) It converts success into panic for easier debugging

# Hint
Same idea exists for `Result<Option<_>, _>` too.

# Explanation
`transpose` flips nesting: `Some(Ok(v))` → `Ok(Some(v))`, `Some(Err(e))` → `Err(e)`, `None` → `Ok(None)`. Handy after combinators that produce the “wrong” outer type for `?`.
