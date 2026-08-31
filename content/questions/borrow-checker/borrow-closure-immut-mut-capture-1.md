---
id: borrow-closure-immut-mut-capture-1
categorySlug: borrow-checker
title: "Closure Capture Inference Rules"
difficulty: 2
tags: [borrow-checker, closure, capture]
---

# Prompt
How does the compiler infer whether a closure captures a local binding by `&T` vs `&mut T`?

# Options
- [ ] A) The closure automatically implements the Copy trait
- [x] B) It captures by &mut if any captured path is mutated
- [ ] C) It clones the variable to avoid mutable borrow rules
- [ ] D) It promotes all captured variables into static memory

# Hint
The compiler infers the least restrictive capture mode required by the closure body.

# Explanation
Rust infers capture modes automatically: if the closure body only reads the variable, it borrows by shared reference `&T`; if it mutates the variable, it borrows by unique reference `&mut T`.
