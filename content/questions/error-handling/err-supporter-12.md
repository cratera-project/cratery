---
id: err-supporter-12
categorySlug: error-handling
title: "Option::unwrap_or_default Requirement"
difficulty: 1
tags: [error-handling, default, option]
---

# Prompt
What trait must `T` implement to call `opt.unwrap_or_default()` on `Option<T>`?

# Code
```rust
fn main() {
    let opt: Option<Vec<i32>> = None;
    let v = opt.unwrap_or_default();
    assert!(v.is_empty());
}
```

# Options
- [x] A) `std::default::Default`
- [ ] B) `std::marker::Copy` in code
- [ ] C) `std::clone::Clone` in code
- [ ] D) `std::fmt::Display` in code

# Hint
unwrap_or_default constructs Default::default() if the option is None.

# Explanation
`Option::unwrap_or_default()` returns the contained value if `Some(v)`, or `Default::default()` if `None`. It requires `T: Default`.
