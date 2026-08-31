---
id: iter-supporter-22
categorySlug: iterators-closures
title: "Iterator::enumerate Counter Type"
difficulty: 1
tags: [iterators-closures, enumerate, types]
---

# Prompt
What type is used for the index in `iter.enumerate()`?

# Code
```rust
fn main() {
    for (i, val) in ["a", "b"].into_iter().enumerate() {
        let _idx: usize = i;
        let _ = val;
    }
}
```

# Options
- [x] A) The pointer-width integer `usize`
- [ ] B) The 32-bit unsigned integer `u32`
- [ ] C) The 64-bit unsigned integer `u64`
- [ ] D) The pointer-width integer `isize`

# Hint
enumerate yields (usize, Item) tuples starting from 0.

# Explanation
`Iterator::enumerate` yields `(usize, Item)` pairs, with the zero-based index typed as `usize` matching pointer widths.
