---
id: ptr-nonnull-dangling-1
categorySlug: pointers
title: "NonNull Dangling Pointer"
difficulty: 2
tags: [pointers, non-null, dangling]
---

# Prompt
What does `std::ptr::NonNull::dangling()` return?

# Options
- [x] A) It returns a well-aligned non-null sentinel pointer
- [ ] B) It allocates one byte from OS virtual memory pool
- [ ] C) It panics immediately if the generic type is zero
- [ ] D) It points directly to the start of program binary

# Hint
NonNull::dangling produces a properly aligned sentinel pointer for empty containers.

# Explanation
`NonNull::dangling()` returns a properly aligned, non-null pointer without allocating memory, widely used by collections (like empty `Vec`) as a sentinel.
