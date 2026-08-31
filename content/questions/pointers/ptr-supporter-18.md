---
id: ptr-supporter-18
categorySlug: pointers
title: "PhantomPinned Role"
difficulty: 2
tags: [pointers, phantom-pinned, unpin]
---

# Prompt
What is `std::marker::PhantomPinned` used for in structs?

# Code
```rust
use std::marker::PhantomPinned;

struct Struct {
    _pin: PhantomPinned,
}
```

# Options
- [ ] A) Pinning the struct to a specific physical CPU processor core
- [x] B) Opting the struct out of the auto trait `Unpin` (`!Unpin`)
- [ ] C) Preventing the struct from being dropped at end of scope in code
- [ ] D) Enabling automatic multi-threaded thread synchronization in code

# Hint
PhantomPinned implements !Unpin, making any containing struct !Unpin.

# Explanation
`PhantomPinned` is a marker type that does not implement `Unpin`. Adding a `_pin: PhantomPinned` field makes the enclosing struct `!Unpin`, enabling compile-time pinning guarantees.
