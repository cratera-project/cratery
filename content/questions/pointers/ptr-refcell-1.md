---
id: ptr-refcell-1
categorySlug: pointers
title: "RefCell Borrow Rules"
difficulty: 3
tags: [pointers, refcell]
---

# Prompt
What happens if you call `borrow_mut` while a `borrow` is active?

# Code
```rust
use std::cell::RefCell;
let x = RefCell::new(5);
let r = x.borrow();
let m = x.borrow_mut();
```

# Options
- [ ] A) It compiles and both guards alias safely
- [x] B) It panics at runtime when borrow rules break
- [ ] C) It fails at compile time like ordinary `&`/`&mut`
- [ ] D) It blocks the thread until `r` is dropped

# Hint
`RefCell` moves borrow checking to runtime.

# Explanation
`RefCell` enforces the same exclusive/shared rules dynamically. A second conflicting borrow panics (or `try_borrow_mut` returns `Err`). It is not thread-safe and does not block.
