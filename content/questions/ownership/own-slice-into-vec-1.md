---
id: own-slice-into-vec-1
categorySlug: ownership
title: "Slice to Vector Conversion"
difficulty: 1
tags: [ownership, slice, vec]
---

# Prompt
How does `[T]::to_vec(&self)` manage memory when `T: Clone`?

# Options
- [ ] A) It reuses the slice capacity without allocation
- [ ] B) It converts the reference into a fat raw pointer
- [x] C) It clones each item into a newly allocated vector
- [ ] D) It borrows the underlying backing slice in-place

# Hint
Creating an owned Vec from a borrowed slice requires allocating.

# Explanation
`to_vec` allocates a new `Vec<T>` on the heap and clones each element from the borrowed slice into the newly allocated buffer.
