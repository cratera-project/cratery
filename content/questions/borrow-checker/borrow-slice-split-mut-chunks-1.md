---
id: borrow-slice-split-mut-chunks-1
categorySlug: borrow-checker
title: "Mutable Chunking with chunks_mut"
difficulty: 2
tags: [borrow-checker, slice, chunks_mut]
---

# Prompt
What borrow safety guarantee does `slice.chunks_mut(size)` provide?

# Options
- [x] A) It returns an iterator yielding disjoint mutable chunks
- [ ] B) It clones each chunk into separate heap vectors on read
- [ ] C) It converts the slice into an immutable shared reference
- [ ] D) It requires all elements to implement the Copy trait

# Hint
Each chunk yielded is disjoint and non-overlapping with every other chunk.

# Explanation
`chunks_mut` returns an iterator yielding disjoint mutable sub-slices `&mut [T]`, allowing distinct chunks of the same parent slice to be mutated without aliasing.
