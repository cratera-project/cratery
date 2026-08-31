---
id: ptr-supporter-26
categorySlug: pointers
title: "Box with Custom Allocator"
difficulty: 3
tags: [pointers, box, allocators]
---

# Prompt
How does `Box::new_in(val, alloc)` utilize custom allocators in nightly Rust?

# Code
```rust
// Box::new_in(42, CustomAllocator)
```

# Options
- [ ] A) Creates an arena in thread stack space for all future allocations in runtime memory
- [x] B) Allocates memory using the provided allocator instead of the global allocator
- [ ] C) Converts the pointer into an immutable reference in read-only RAM in runtime memory
- [ ] D) Bypasses memory fragmentation by compressing CPU cache lines within local thread memory

# Hint
Allocator-aware collections parameterize allocation via the Allocator trait.

# Explanation
`Box::new_in` (and the `Allocator` API) allows collections and smart pointers to allocate and deallocate their heap memory using custom memory managers (such as arenas or pool allocators).
