---
id: borrow-cell-borrow-mut-1
categorySlug: borrow-checker
title: "RefCell Dynamic Borrow Rule"
difficulty: 2
tags: [borrow-checker, refcell]
---

# Prompt
What happens when calling `borrow_mut()` on a `RefCell` that already has an active `borrow()`?

# Options
- [ ] A) It emits a compile-time borrow check type error
- [ ] B) It silently blocks the thread until release occurs
- [ ] C) It creates an undefined behavior memory corruption
- [x] D) It panics dynamically at runtime upon second borrow

# Hint
RefCell tracks borrowing rules dynamically at runtime.

# Explanation
`RefCell` enforces aliasing rules dynamically. Attempting to acquire `borrow_mut()` while an active `Ref` exists panics with `AlreadyBorrowed`.
