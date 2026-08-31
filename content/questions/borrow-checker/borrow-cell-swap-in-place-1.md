---
id: borrow-cell-swap-in-place-1
categorySlug: borrow-checker
title: "Cell Value Swapping with Cell::swap"
difficulty: 2
tags: [borrow-checker, cell, swap]
---

# Prompt
Why is `Cell::swap(&cell_a, &cell_b)` sound without creating references to inner data?

# Options
- [x] A) It swaps inner values of two Cells without references
- [ ] B) It allocates temporary clone buffers in thread memory
- [ ] C) It triggers a runtime panic if both cells are shared
- [ ] D) It requires unsafe blocks to bypass aliasing checks

# Hint
Cell never hands out direct references to its internal payload.

# Explanation
`Cell<T>` never exposes references `&T` or `&mut T` to its contents; `swap` performs an in-place value swap on stack/heap without creating intermediate aliasing references.
