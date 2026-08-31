---
id: borrow-stacked-borrows-tree-1
categorySlug: borrow-checker
title: "Stacked Borrows Model"
difficulty: 3
tags: [borrow-checker, stacked-borrows, miri, aliasing]
---

# Prompt
What is the purpose of the Stacked Borrows / Tree Borrows aliasing model in Rust (Miri)?

# Options
- [ ] A) It tracks operating system virtual memory page mappings
- [x] B) It models pointer provenance as an aliasing borrow stack
- [ ] C) It enforces garbage collection cycles in unsafe blocks
- [ ] D) It replaces static borrow checking with dynamic mutexes

# Hint
Stacked Borrows formally defines which pointers are valid to dereference based on borrow hierarchy.

# Explanation
Stacked Borrows is an operational semantics model for Rust defining pointer provenance and aliasing rules, ensuring compiler optimizations (like `noalias`) remain sound.
