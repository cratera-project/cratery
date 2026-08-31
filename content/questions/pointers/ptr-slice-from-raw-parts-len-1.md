---
id: ptr-slice-from-raw-parts-len-1
categorySlug: pointers
title: "Raw Slice Pointer Construction"
difficulty: 2
tags: [pointers, slice-from-raw-parts, raw]
---

# Prompt
Why is `std::ptr::slice_from_raw_parts` a safe (non-unsafe) function?

# Options
- [ ] A) It allocates an owned slice vector on the system heap
- [ ] B) It panics at runtime if the pointer address is null
- [x] C) It constructs a raw fat pointer *const [T] safely
- [ ] D) It dereferences the pointer to verify element bounds

# Hint
Constructing a raw fat pointer (*const [T]) does not dereference memory or create references.

# Explanation
`slice_from_raw_parts` merely packages a data pointer and length into a fat raw pointer `*const [T]`. Because raw pointers are not dereferenced, the constructor itself is safe.
