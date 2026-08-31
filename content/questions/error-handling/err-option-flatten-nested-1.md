---
id: err-option-flatten-nested-1
categorySlug: error-handling
title: "Option Flattening"
difficulty: 1
tags: [error-handling, option, flatten]
---

# Prompt
What is the printed output?

# Code
```rust
fn main() {
    let a: Option<Option<i32>> = Some(Some(10));
    let b: Option<Option<i32>> = Some(None);
    let c: Option<Option<i32>> = None;
    println!("{:?}", (a.flatten(), b.flatten(), c.flatten()));
}
```

# Options
- [x] A) (Some(10), None, None) because inner None collapses
- [ ] B) (Some(10), Some(None), None) because b stays nested
- [ ] C) (Some(10), None, Some(None)) due to default unwraps
- [ ] D) Compile error because Option has no flatten() method

# Hint
How does flattening nested Option layers handle inner and outer None values?

# Explanation
`Option::flatten` converts `Option<Option<T>>` into `Option<T>`. If the outer option is `Some(Some(v))`, it returns `Some(v)`. If the outer option is `Some(None)` or `None`, it returns `None`. Thus, `a.flatten()` produces `Some(10)`, while both `b.flatten()` and `c.flatten()` evaluate to `None`.
