---
id: own-box-from-raw-1
categorySlug: ownership
title: "Box from_raw Safety Invariant"
difficulty: 3
tags: [ownership, box, from-raw, safety]
---

# Prompt
What safety invariant is required when calling `Box::from_raw(raw_ptr)`?

# Options
- [ ] A) It must be called on stack pointers allocated by let
- [ ] B) It allocates a new Box buffer and copies raw bytes
- [x] C) The pointer must come from Box::into_raw with same type
- [ ] D) It zeroes out the underlying memory buffer on entry

# Hint
from_raw reconstructs a Box from a pointer previously allocated via Box.

# Explanation
`Box::from_raw` requires that the pointer was previously obtained from `Box::into_raw` with the matching allocator layout, alignment, and type `T`.
