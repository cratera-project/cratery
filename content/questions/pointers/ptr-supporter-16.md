---
id: ptr-supporter-16
categorySlug: pointers
title: "Pin::new_unchecked Invariants"
difficulty: 3
tags: [pointers, pin, contracts]
---

# Prompt
When calling `unsafe { Pin::new_unchecked(ptr) }`, what must the caller uphold?

# Code
```rust
use std::pin::Pin;

struct Unmovable;

fn pin_it(u: &mut Unmovable) -> Pin<&mut Unmovable> {
    unsafe { Pin::new_unchecked(u) }
}
```

# Options
- [ ] A) Ensure the struct is allocated directly on the thread-local stack in runtime memory
- [ ] B) Verify that the pointee contains no atomic variable fields within local thread memory
- [ ] C) Register the memory address with the global operating system allocator in code
- [x] D) Guarantee that the pointee will never be moved before its destructor is run

# Hint
The core pinning contract is that the pinned object will never be moved until dropped.

# Explanation
`Pin::new_unchecked` is unsafe because the caller must uphold the Pin contract: once pinned, the memory location occupied by the pointee must not be overwritten, moved, or deallocated without dropping.
