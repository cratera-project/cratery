---
id: err-ok-or-1
categorySlug: error-handling
title: "Option to Result"
difficulty: 2
tags: [error-handling, option, result]
---

# Prompt
What does `ok_or` accomplish here?

# Code
```rust
fn get(map: &HashMap<i32, i32>, k: i32) -> Result<i32, String> {
    map.get(&k).copied().ok_or(format!("missing {k}"))
}
```

# Options
- [x] A) It turns `None` into `Err` with the given error
- [ ] B) It panics when the key is missing from the map
- [ ] C) It ignores the error and always returns `Ok(0)`
- [ ] D) It converts `Err` values back into `None` cases

# Hint
`Some(v)` becomes `Ok(v)`; `None` needs an error.

# Explanation
`ok_or(err)` maps `Some(v)` → `Ok(v)` and `None` → `Err(err)`. That bridges lookup APIs (`Option`) into fallible APIs (`Result`) so `?` can propagate a typed failure.
