---
id: borrow-slice-split-1
categorySlug: borrow-checker
title: "split_at_mut Purpose"
difficulty: 2
tags: [borrowing, slices]
---

# Prompt
What problem does `split_at_mut` solve?

# Code
```rust
let mut v = [1, 2, 3, 4];
let (left, right) = v.split_at_mut(2);
left[0] = 9;
right[0] = 8;
```

# Options
- [ ] A) It clones the array so both halves own separate data
- [x] B) It yields two non-overlapping `&mut` slices safely
- [ ] C) It converts arrays into `Vec` before any mutation
- [ ] D) It allows aliasing the same element through two refs

# Hint
Safe Rust needs a proof the slices do not overlap.

# Explanation
You cannot take two `&mut` borrows of overlapping parts of the same slice via ordinary indexing. `split_at_mut` (implemented with `unsafe` internally, safe API) returns disjoint halves the borrow checker accepts.
