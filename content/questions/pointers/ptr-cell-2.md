---
id: ptr-cell-2
categorySlug: pointers
title: "Cell::get Constraint"
difficulty: 3
tags: [pointers, cell]
---

# Prompt
Why is `Cell::get` only for `T: Copy`?

# Code
```rust
use std::cell::Cell;
let c = Cell::new(5);
let x = c.get();
```

# Options
- [ ] A) `Cell` exists only for integer primitive types
- [ ] B) `get` moves `T` out and leaves the cell empty
- [x] C) `get` returns `T` by value, so `T` must be `Copy`
- [ ] D) `Copy` is required for `Cell` to be `Send + Sync`

# Hint
Returning `T` through `&self` cannot move a non-`Copy` value.

# Explanation
`get` copies the contained value out. Restricting it to `T: Copy` avoids moving a non-`Copy` value through a shared reference. Non-`Copy` types use `replace`/`take` (when `T: Default`) or `RefCell` instead. `Cell` is not `Sync`.
