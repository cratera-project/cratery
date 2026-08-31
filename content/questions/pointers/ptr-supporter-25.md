---
id: ptr-supporter-25
categorySlug: pointers
title: "std::ptr::read_unaligned"
difficulty: 2
tags: [pointers, unaligned, parsing]
---

# Prompt
When should `std::ptr::read_unaligned` be used?

# Code
```rust
use std::ptr;

fn read_u32_from_bytes(bytes: &[u8]) -> u32 {
    unsafe { ptr::read_unaligned(bytes.as_ptr() as *const u32) }
}
```

# Options
- [x] A) When reading structured binary data from packed or arbitrary byte offsets
- [ ] B) When synchronizing atomic memory across CPU core pipelines in runtime memory
- [ ] C) When allocating dynamic heap buffers inside async tasks within local thread memory
- [ ] D) When converting trait objects into concrete struct types within local thread memory

# Hint
read_unaligned copies bytes without requiring alignment to T's boundary.

# Explanation
`std::ptr::read_unaligned` reads a `T` from a raw pointer that may not be aligned to `align_of::<T>()`. It is common in network packet parsing and binary protocol deserialization.
