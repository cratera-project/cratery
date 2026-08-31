---
id: ptr-rc-refcell-1
categorySlug: pointers
title: "Rc plus RefCell"
difficulty: 3
tags: [pointers, rc, refcell]
---

# Prompt
Why combine `Rc<RefCell<T>>`?

# Code
```rust
use std::cell::RefCell;
use std::rc::Rc;
let shared = Rc::new(RefCell::new(0));
*shared.borrow_mut() += 1;
```

# Options
- [x] A) `Rc` shares ownership; `RefCell` allows mutation
- [ ] B) `RefCell` shares threads; `Rc` counts atomically
- [ ] C) `Rc` provides locks; `RefCell` stores the mutex
- [ ] D) Together they make `T` automatically `Send + Sync`

# Hint
Separate “who owns it” from “can I mutate through `&`.”

# Explanation
`Rc` enables multiple owners; by itself the inner `T` is immutable through those owners. Wrapping with `RefCell` adds single-threaded interior mutability so owners can `borrow_mut`. The combo is still not thread-safe.
