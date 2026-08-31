---
id: ptr-rc-get-mut-1
categorySlug: pointers
title: "Rc::get_mut"
difficulty: 2
tags: [pointers, rc]
---

# Prompt
When does `Rc::get_mut` return `Some`?

# Code
```rust
use std::rc::Rc;
let mut a = Rc::new(1);
let m = Rc::get_mut(&mut a);
```

# Options
- [ ] A) Only after upgrading a `Weak` into a strong `Rc`
- [ ] B) Whenever `T` implements `Clone`, regardless of count
- [ ] C) Never on stable; use `RefCell` for all `Rc` mutation
- [x] D) When no other `Rc` or `Weak` shares the allocation

# Hint
Unique ownership unlocks a mutable borrow of `T`.

# Explanation
`Rc::get_mut` yields `&mut T` only when this handle is exclusive: strong count 1 and weak count 0. Another `Rc` or any `Weak` makes it return `None`. Shared mutation otherwise needs interior mutability.
