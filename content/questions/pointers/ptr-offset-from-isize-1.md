---
id: ptr-offset-from-isize-1
categorySlug: pointers
title: "Pointer Offset From Invariant"
difficulty: 3
tags: [pointers, offset, safety]
---

# Prompt
What condition is required for `ptr.offset_from(origin)` to be sound?

# Options
- [ ] A) Both pointers can point to separate global static arrays
- [ ] B) The operation ignores byte padding between array elements
- [x] C) Both pointers must originate from same memory allocation
- [ ] D) Pointers must be aligned to 64-byte hardware cache lines

# Hint
Pointer subtraction requires both pointers to point within the same allocated object.

# Explanation
`offset_from` requires that both pointers point to or one past the end of the same allocated object and that their distance in bytes fits in `isize`.
