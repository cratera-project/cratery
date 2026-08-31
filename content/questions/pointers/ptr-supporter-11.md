---
id: ptr-supporter-11
categorySlug: pointers
title: "RefCell try_borrow_mut Error Handling"
difficulty: 2
tags: [pointers, refcell, borrow-error]
---

# Prompt
What does `cell.try_borrow_mut()` return if the `RefCell` is already borrowed?

# Code
```rust
use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(5);
    let _r = cell.borrow();
    let res = cell.try_borrow_mut();
    assert!(res.is_err());
}
```

# Options
- [ ] A) Panics immediately with an assertion error
- [ ] B) Blocks the calling thread until the borrow ends
- [x] C) `Err(BorrowMutError)` without panicking
- [ ] D) `Ok(None)` indicating an empty reference guard

# Hint
try_borrow_mut returns a Result instead of panicking on borrow conflicts.

# Explanation
`RefCell::try_borrow_mut` is the non-panicking counterpart of `borrow_mut()`. If an existing borrow is active, it returns `Err(BorrowMutError)` allowing the caller to handle the conflict gracefully.
