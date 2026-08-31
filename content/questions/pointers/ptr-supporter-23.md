---
id: ptr-supporter-23
categorySlug: pointers
title: "Cell vs RefCell Overhead"
difficulty: 2
tags: [pointers, cell, overhead]
---

# Prompt
What is the memory and runtime overhead of `std::cell::Cell<u64>` compared to `u64`?

# Code
```rust
use std::cell::Cell;

fn main() {
    assert_eq!(std::mem::size_of::<Cell<u64>>(), std::mem::size_of::<u64>());
}
```

# Options
- [ ] A) 8 bytes of borrow counter state and atomic CAS overhead in runtime memory
- [ ] B) 16 bytes for vtable dispatch and thread identifier metadata in runtime memory
- [x] C) Zero memory and zero runtime overhead (pure zero-cost abstraction)
- [ ] D) 1 byte for runtime lock flags checked on every read in runtime memory

# Hint
Cell has zero runtime borrow checks and the exact same memory layout as the inner type.

# Explanation
`Cell<T>` has identical memory layout and size as `T` with zero runtime check overhead. It achieves interior mutability purely through compile-time ownership rules (`get`/`set` by value).
