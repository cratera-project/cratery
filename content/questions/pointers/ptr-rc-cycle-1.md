---
id: ptr-rc-cycle-1
categorySlug: pointers
title: "Reference Cycles"
difficulty: 2
tags: [pointers, rc, weak]
---

# Prompt
How can `Rc` leak memory even in safe Rust?

# Code
```rust
use std::rc::Rc;
use std::cell::RefCell;

struct Node {
    next: Option<Rc<RefCell<Node>>>,
}
```

# Options
- [ ] A) Safe Rust forbids cycles; this type will not compile
- [x] B) Cycles keep strong counts above zero, blocking drop
- [ ] C) `Rc` always leaks unless you call `mem::forget`
- [ ] D) `RefCell` disables destructors for any nested `Rc`

# Hint
`Weak` breaks ownership cycles.

# Explanation
If two `Rc` values point at each other (a cycle), strong counts never reach zero and the allocations are never dropped, a memory leak. Use `Weak` for non-owning back-edges (parent/child graphs).
