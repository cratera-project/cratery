---
id: life-ref-mut-invariant-param-1
categorySlug: lifetimes
title: "Mutable Reference Invariance"
difficulty: 3
tags: [lifetimes, variance, invariance]
---

# Prompt
Why is `&mut T` invariant over its inner type parameter `T`?

# Options
- [x] A) Unique references &mut T are invariant over their type T
- [ ] B) Unique references &mut T are covariant over their type T
- [ ] C) Unique references &mut T are contravariant over type T
- [ ] D) Unique references ignore variance checks during typeck

# Hint
If &mut T were covariant, you could write a short-lived reference into a long-lived container.

# Explanation
`&mut T` must be invariant over `T` because it allows reading from and writing to `T`. Covariance would allow writing a shorter-lived reference into a place expected to live longer.
