---
id: iter-fuse-once-none-1
categorySlug: iterators-closures
title: "Iterator Fuse Adapter"
difficulty: 2
tags: [iterators-closures, fuse]
---

# Prompt
What guarantee does `.fuse()` provide on an arbitrary iterator?

# Options
- [ ] A) It wraps each yielded element into an Option variant
- [ ] B) It allocates an internal backing ring buffer on heap
- [x] C) It guarantees that once None is returned it stays None
- [ ] D) It resets the iterator pointer back to beginning node

# Hint
A fused iterator will never yield Some after returning None.

# Explanation
`fuse()` adapts any iterator so that once `next()` returns `None`, all subsequent calls to `next()` are guaranteed to keep returning `None`.
