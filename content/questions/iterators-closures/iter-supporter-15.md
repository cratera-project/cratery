---
id: iter-supporter-15
categorySlug: iterators-closures
title: "FromIterator for Result (Collection of Results)"
difficulty: 2
tags: [iterators-closures, collect, result-transposition]
---

# Prompt
What does `items.into_iter().collect::<Result<Vec<T>, E>>()` do on error?

# Code
```rust
fn main() {
    let strings = vec!["1", "two", "3"];
    let parsed: Result<Vec<i32>, _> = strings.into_iter().map(|s| s.parse::<i32>()).collect();
    assert!(parsed.is_err());
}
```

# Options
- [ ] A) Collects all successful elements, discarding any errors silently in code
- [x] B) Short-circuits on the first `Err` and returns that `Err` immediately
- [ ] C) Panics with an unwrap error when the first failure occurs in runtime memory
- [ ] D) Accumulates all errors into a composite multi-error vector in runtime memory

# Hint
collecting an Iterator of Results into a Result of Collection stops at the first Err.

# Explanation
`FromIterator` for `Result<V, E>` collects an iterator of `Result<T, E>`: if all are `Ok(x)`, it returns `Ok(Vec<T>)`; on the first `Err(e)`, iteration stops and `Err(e)` is returned immediately.
