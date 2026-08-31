---
id: err-unwrap-or-else-1
categorySlug: error-handling
title: "unwrap_or_else"
difficulty: 2
tags: [error-handling, option, result]
---

# Prompt
When is `unwrap_or_else` preferable to `unwrap_or`?

# Code
```rust
fn fallback() -> i32 {
    expensive_default()
}

let n = maybe_number.unwrap_or_else(fallback);
// vs maybe_number.unwrap_or(expensive_default());
```

# Options
- [x] A) When the default must be computed only on failure
- [ ] B) When you want a panic instead of a default value
- [ ] C) When the success path needs a different concrete type
- [ ] D) When `unwrap_or` is unavailable on stable Rust today

# Hint
`unwrap_or` always evaluates its argument first.

# Explanation
`unwrap_or(default)` evaluates `default` eagerly even on `Some`/`Ok`. `unwrap_or_else(f)` calls `f` only for `None`/`Err`, which matters for expensive or side-effecting defaults. Both exist on stable.
