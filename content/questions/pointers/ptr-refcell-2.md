---
id: ptr-refcell-2
categorySlug: pointers
title: "RefCell Guarantees"
difficulty: 3
tags: [pointers, refcell, interior-mutability]
---

# Prompt
Which statement best describes `RefCell<T>`?

# Code
```rust
use std::cell::RefCell;
let x = RefCell::new(vec![1, 2, 3]);
let r = x.borrow();
```

# Options
- [ ] A) Compile-time borrow checks like ordinary references
- [ ] B) Thread-safe lock-free shared mutation of `T`
- [ ] C) Unchecked aliasing with mutation always allowed
- [x] D) Runtime enforcement of single-writer borrow rules

# Hint
Interior mutability does not remove the borrow rules.

# Explanation
`RefCell<T>` provides interior mutability with runtime borrow checking: many `borrow`s or one `borrow_mut`, never both. Violations panic. It is not `Sync`.
