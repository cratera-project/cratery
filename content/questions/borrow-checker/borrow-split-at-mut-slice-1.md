---
id: borrow-split-at-mut-slice-1
categorySlug: borrow-checker
title: "Slice Splitting with split_at_mut"
difficulty: 2
tags: [borrow-checker, slice, split]
---

# Prompt
Why is `split_at_mut` essential when working with mutable slices?

# Options
- [ ] A) It allocates two separate sub-vectors on the heap
- [x] B) It splits one mutable slice into two disjoint views
- [ ] C) It converts the slice into unsafe raw pointer pairs
- [ ] D) It acquires a read-write lock across the collection

# Hint
Indexing a slice twice mutably fails borrow check without helper.

# Explanation
`split_at_mut` uses safe encapsulation over unsafe pointers to split one `&mut [T]` into two non-overlapping mutable slices that can be modified concurrently.
