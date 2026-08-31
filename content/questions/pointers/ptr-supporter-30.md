---
id: ptr-supporter-30
categorySlug: pointers
title: "Pin and Box::pin"
difficulty: 2
tags: [pointers, pin, box]
---

# Prompt
What does `Box::pin(value)` return?

# Code
```rust
use std::pin::Pin;

fn main() {
    let pinned: Pin<Box<i32>> = Box::pin(42);
    println!("{pinned}");
}
```

# Options
- [ ] A) `&mut Pin<T>` borrowing directly from the current stack
- [x] B) `Pin<Box<T>>` with the value pinned in heap memory
- [ ] C) `Pin<&'static T>` pointing to read-only binary text
- [ ] D) `Box<Pin<T>>` with unpinned inner reference capabilities

# Hint
Box::pin allocates the value on the heap and wraps the Box in a Pin.

# Explanation
`Box::pin(x)` allocates `x` on the heap and returns `Pin<Box<T>>`. Because heap allocations have stable addresses that do not move unless explicitly reallocated, heap pinning is safe for any type.
