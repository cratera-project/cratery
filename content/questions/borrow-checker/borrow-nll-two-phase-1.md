---
id: borrow-nll-two-phase-1
categorySlug: borrow-checker
title: "Two-Phase Borrows"
difficulty: 2
tags: [borrow-checker, nll, two-phase]
---

# Prompt
Why is `v.push(v.len())` valid under Non-Lexical Lifetimes (NLL)?

# Options
- [ ] A) The compiler moves the vector into the push method
- [x] B) A reserved mutable borrow activates upon method call
- [ ] C) Rust clones the receiver before evaluating arguments
- [ ] D) The operation produces an undefined behavior warning

# Hint
Two-phase borrows allow shared reads while the mutable borrow is reserved.

# Explanation
Under two-phase borrows, `&mut v` is reserved for `push()`, allowing shared read `v.len()` in arguments before activating the mutable borrow upon entry.
