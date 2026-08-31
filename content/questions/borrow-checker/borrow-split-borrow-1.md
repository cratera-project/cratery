---
id: borrow-split-borrow-1
categorySlug: borrow-checker
title: "Splitting Borrows"
difficulty: 3
tags: [borrowing, split]
---

# Prompt
Why does this compile despite two mutable slices?

# Code
```rust
let mut v = vec![1, 2, 3, 4];
let (left, right) = v.split_at_mut(2);
left[0] = 10;
right[0] = 20;
```

# Options
- [ ] A) `Vec` always allows multiple overlapping `&mut` slices
- [ ] B) Separate statements end each borrow before the next
- [ ] C) Integer elements implement `Copy`, so aliasing is fine
- [x] D) `split_at_mut` yields disjoint non-overlapping borrows

# Hint
Exclusive borrows are illegal only when they alias the same memory.

# Explanation
Multiple `&mut` are rejected when they alias. `split_at_mut` guarantees the two slices cover disjoint ranges, so both can be mutable at once. The compiler accepts this safe API as proving non-aliasing.
