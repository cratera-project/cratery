---
id: borrow-supporter-22
categorySlug: borrow-checker
title: "Mutable Borrow Lifetime Subtyping"
difficulty: 3
tags: [borrow-checker, lifetimes, variance]
---

# Prompt
Can you assign a `&'a mut T` to a `&'b mut T` where `'a` outlives `'b` (`'a: 'b`)?

# Code
```rust
fn shorten<'a, 'b: 'a, T>(r: &'b mut T) -> &'a mut T {
    r
}
```

# Options
- [ ] A) No; mutable references are invariant over their lifetime parameter
- [ ] B) Only if `T` implements the `Copy` marker trait during runtime execution
- [ ] C) Only if the assignment is wrapped inside an unsafe block in code
- [x] D) Yes; `&'a mut T` is covariant over its lifetime parameter `'a`

# Hint
&'a mut T is covariant in 'a (even though it is invariant in T).

# Explanation
&'a mut T is covariant with respect to 'a (while invariant with respect to T). Therefore, a longer lifetime 'b can be shortened to a shorter lifetime 'a when passing or returning.
