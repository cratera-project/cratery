---
id: life-outlives-bound-1
categorySlug: lifetimes
title: "Outlives Bounds"
difficulty: 2
tags: [lifetimes, bounds]
---

# Prompt
What does `T: 'a` mean in this signature?

# Code
```rust
fn stash<'a, T: 'a>(x: T) -> &'a T {
    // illustrative: needs a place that lives for 'a
    Box::leak(Box::new(x))
}
```

# Options
- [ ] A) `T` must be a reference with lifetime exactly `'a`
- [ ] B) `T` is required to implement the `Copy` trait too
- [x] C) All borrows inside `T` must outlive lifetime `'a`
- [ ] D) `T` is dropped immediately when `'a` begins

# Hint
Owned types with no borrows satisfy every `T: 'a`.

# Explanation
`T: 'a` means `T` is valid for `'a`: any references inside `T` outlive `'a`. Plain owned values like `i32` or `String` satisfy it. It does not force `T` itself to be a reference.
