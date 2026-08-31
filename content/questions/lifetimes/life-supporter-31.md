---
id: life-supporter-31
categorySlug: lifetimes
title: "Lifetime Variance in Vec<T>"
difficulty: 3
tags: [lifetimes, vec, variance]
---

# Prompt
Is Vec<&'static str> convertible to Vec<&'a str> by subtyping?

# Code
```rust
fn check<'a>(v: Vec<&'static str>) -> Vec<&'a str> {
    v
}
```

# Options
- [ ] A) No, Vec<T> is invariant because its buffer is mutable
- [x] B) Yes, Vec<T> is covariant with respect to T
- [ ] C) No, Vec requires explicit .iter().cloned().collect()
- [ ] D) Yes, but only for primitive Copy types like integers

# Hint
Vec owns its elements, so Vec<T> is covariant in T.

# Explanation
Vec<T> owns its allocation and has no shared mutable aliasing through Vec<T>. Therefore Vec<T> is covariant over T, allowing Vec<&'static str> to be used as Vec<&'a str>.
