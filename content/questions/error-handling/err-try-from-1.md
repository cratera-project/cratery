---
id: err-try-from-1
categorySlug: error-handling
title: "TryFrom Fallible Conversion"
difficulty: 2
tags: [error-handling, tryfrom]
---

# Prompt
When is `TryFrom` preferable to `From`?

# Code
```rust
use std::convert::TryFrom;

impl TryFrom<i32> for Percent {
    type Error = String;
    fn try_from(v: i32) -> Result<Self, Self::Error> {
        if (0..=100).contains(&v) { Ok(Percent(v)) } else { Err("range".into()) }
    }
}
```

# Options
- [ ] A) When every `i32` value is always a valid `Percent`
- [x] B) When conversion can fail and should return `Result`
- [ ] C) When you need faster code than a plain `From` impl
- [ ] D) When the types are identical and no check is needed

# Hint
`From` is infallible; `TryFrom` can reject inputs.

# Explanation
`From`/`Into` must always succeed. Use `TryFrom`/`TryInto` when some inputs are invalid (range, parse shape) and callers should handle `Err`. Infallible cases stay on `From`.
