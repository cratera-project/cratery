---
id: ptr-copy-nonoverlapping-memcpy-1
categorySlug: pointers
title: "ptr::copy_nonoverlapping Invariant"
difficulty: 2
tags: [pointers, copy, memcpy, safety]
---

# Prompt
What condition must hold when calling `std::ptr::copy_nonoverlapping`?

# Options
- [ ] A) Source and destination memory regions are allowed to overlap
- [x] B) Source and destination memory regions must not overlap at all
- [ ] C) It allocates an intermediate heap buffer during memory copy
- [ ] D) It runs destructors for existing values at the target memory

# Hint
copy_nonoverlapping corresponds to C's memcpy and forbids overlapping memory.

# Explanation
`copy_nonoverlapping` requires that the source and destination memory regions do not overlap (equivalent to `memcpy`). For overlapping memory, use `ptr::copy` (memmove).
