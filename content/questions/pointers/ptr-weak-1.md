---
id: ptr-weak-1
categorySlug: pointers
title: "Weak Upgrade"
difficulty: 3
tags: [pointers, weak, rc]
---

# Prompt
What does `Weak::upgrade` return?

# Code
```rust
use std::rc::{Rc, Weak};
let strong = Rc::new(5);
let weak: Weak<i32> = Rc::downgrade(&strong);
let maybe = weak.upgrade();
```

# Options
- [x] A) `Option<Rc<T>>`: `None` if the value is gone
- [ ] B) `Result<Rc<T>, BorrowError>` on contention
- [ ] C) A bare `&T` borrowed from the weak handle
- [ ] D) An `Rc<T>` that panics if the allocation died

# Hint
`Weak` does not keep the allocation alive by itself.

# Explanation
`Weak<T>` is non-owning. `upgrade()` returns `Some(Rc<T>)` if strong owners still exist, otherwise `None`. It does not panic and does not return a plain reference.
