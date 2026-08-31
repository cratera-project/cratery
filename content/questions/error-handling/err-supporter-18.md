---
id: err-supporter-18
categorySlug: error-handling
title: "Option::filter Predicate"
difficulty: 1
tags: [error-handling, option, filter]
---

# Prompt
What does `opt.filter(predicate)` return when `predicate` evaluates to `false`?

# Code
```rust
fn main() {
    let opt = Some(4);
    let filtered = opt.filter(|&x| x % 2 == 1);
    assert_eq!(filtered, None);
}
```

# Options
- [ ] A) `None` indicating no match
- [ ] B) `Some(Default::default())`
- [x] C) `Some(v)` unchanged in place
- [ ] D) `Err(FilterError::NotFound)`

# Hint
filter keeps Some(v) if predicate returns true, and returns None if false.

# Explanation
`Option::filter` returns `Some(v)` if the option is `Some(v)` and `predicate(&v)` is `true`; otherwise it returns `None`.
