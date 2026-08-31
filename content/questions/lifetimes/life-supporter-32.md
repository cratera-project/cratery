---
id: life-supporter-32
categorySlug: lifetimes
title: "Lifetime in Ref and RefMut"
difficulty: 2
tags: [lifetimes, refcell, borrow]
---

# Prompt
What lifetimes are tracked by RefCell::borrow(&'a cell)?

# Code
```rust
use std::cell::RefCell;

fn inspect<'a>(cell: &'a RefCell<String>) {
    let r = cell.borrow();
    println!("{r}");
}
```

# Options
- [ ] A) Promoted to static lifetime via runtime lock in code
- [ ] B) Unconstrained; lives until the process exits in code
- [x] C) Tied to the lifetime 'a of the &RefCell borrow
- [ ] D) Tied to the global dynamic heap allocator in code

# Hint
Ref<'b, T> holds a reference to the RefCell with lifetime 'b.

# Explanation
cell.borrow() returns a Ref<'a, T> that is bound to the lifetime 'a of the &'a RefCell<T>. The guard cannot outlive the cell it borrows from.
