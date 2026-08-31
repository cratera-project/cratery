---
id: borrow-supporter-9
categorySlug: borrow-checker
title: "RefCell Runtime Borrow Flag Checks"
difficulty: 2
tags: [borrow-checker, refcell, panics]
---

# Prompt
What happens at runtime if you violate aliasing rules with `RefCell` (e.g. active `borrow` and calling `borrow_mut`)?

# Code
```rust
use std::cell::RefCell;

fn main() {
    let c = RefCell::new(10);
    let _r = c.borrow();
    // let _m = c.borrow_mut(); // Panics at runtime!
}
```

# Options
- [ ] A) Undefined Behavior and memory corruption in release mode in code
- [ ] B) Blocks the calling thread until the first borrow drops in code
- [x] C) Panics immediately with `already borrowed: BorrowMutError`
- [ ] D) Automatically closes the existing shared borrow reference in code

# Hint
RefCell tracks borrows dynamically at runtime and panics on conflicts.

# Explanation
`RefCell` enforces the borrow rules dynamically using an internal counter. If you attempt to acquire a mutable borrow while a shared borrow is active, `RefCell::borrow_mut` panics immediately.
