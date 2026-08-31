---
id: borrow-supporter-24
categorySlug: borrow-checker
title: "Borrow Checker and Option as_mut"
difficulty: 2
tags: [borrow-checker, as_mut, option]
---

# Prompt
What does `opt.as_mut()` return for a `&mut Option<T>`?

# Code
```rust
fn main() {
    let mut opt = Some(10);
    if let Some(val) = opt.as_mut() {
        *val = 20;
    }
    assert_eq!(opt, Some(20));
}
```

# Options
- [ ] A) `&mut Option<T>` borrowing the entire wrapper during runtime execution
- [x] B) `Option<&mut T>` allowing in-place mutation without moving
- [ ] C) `Option<T>` by value, leaving `None` in place during runtime execution
- [ ] D) A raw pointer `*mut Option<T>` during runtime execution in code

# Hint
as_mut converts &mut Option<T> into Option<&mut T>.

# Explanation
`Option::as_mut(&mut self)` converts `&mut Option<T>` into `Option<&mut T>`, allowing callers to pattern match and mutate the inner value directly in place.
