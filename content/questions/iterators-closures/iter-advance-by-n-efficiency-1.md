---
id: iter-advance-by-n-efficiency-1
categorySlug: iterators-closures
title: "Iterator advance_by Optimization"
difficulty: 2
tags: [iterators-closures, advance-by, performance]
---

# Prompt
What performance benefit does `Iterator::advance_by(n)` provide over repeated `.next()` calls?

# Options
- [ ] A) It calls next() in a dynamic busy loop inside CPU cache
- [x] B) It skips elements in O(1) time when optimized for slices
- [ ] C) It converts the iterator stream into a static linked list
- [ ] D) It panics immediately if the iterator length is unknown

# Hint
advance_by allows iterators over contiguous slices to advance internal pointers in O(1).

# Explanation
`advance_by(n)` allows specialized iterators (like slices and ranges) to jump forward `n` elements in O(1) pointer arithmetic rather than executing an O(n) stepping loop.
