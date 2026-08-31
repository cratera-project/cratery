---
id: ptr-supporter-1
categorySlug: pointers
title: "Pin and !Unpin Types"
difficulty: 3
tags: [pointers, pin, unpin]
---

# Prompt
What guarantee does `Pin<&mut T>` provide when `T` is `!Unpin`?

# Code
```rust
use std::marker::PhantomPinned;
use std::pin::Pin;

struct SelfRef {
    _pin: PhantomPinned,
}

fn check(p: Pin<&mut SelfRef>) {
    let _ = p;
}
```

# Options
- [x] A) `T` will never be moved in memory until its destructor completes
- [ ] B) `T` is allocated exclusively in non-pageable physical RAM
- [ ] C) `T` can only be accessed from a single CPU execution thread
- [ ] D) `T` will never be deallocated from the heap memory buffer

# Hint
Pin guarantees that !Unpin data will not be moved before being dropped.

# Explanation
When `T: !Unpin`, `Pin<&mut T>` prevents moving `T` out of its memory location (e.g. via `std::mem::swap` or `replace`) until `T` is dropped, making self-referential structures completely sound.
