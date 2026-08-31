---
id: life-mut-reborrow-1
categorySlug: lifetimes
title: "Successive Mutable Borrows"
difficulty: 2
tags: [lifetimes, nll, borrowing]
---

# Prompt
Why can `q` be used after `p`’s last use here?

# Code
```rust
fn main() {
    let mut x = 1;
    let p = &mut x;
    *p += 1;
    let q = &mut x;
    *q += 1;
}
```

# Options
- [ ] A) Mutable borrows are `Copy`, so they never conflict
- [ ] B) `x` is implicitly cloned between the two borrows
- [ ] C) This example is rejected; two `&mut` are forever
- [x] D) NLL ends `p`’s borrow before `q` is created

# Hint
Borrows last as long as they are used, not to the end of the block.

# Explanation
These are two successive `&mut` borrows of `x`, not a reborrow of an existing reference. Non-lexical lifetimes end `p` after its last use (`*p += 1`), so `q` can borrow `x` next. Two overlapping live `&mut` aliases would still be rejected.
