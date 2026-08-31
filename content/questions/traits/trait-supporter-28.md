---
id: trait-supporter-28
categorySlug: traits
title: "Unpin Marker Trait"
difficulty: 2
tags: [traits, unpin, pin]
---

# Prompt
What does the `Unpin` marker trait indicate about a type?

# Code
```rust
use std::marker::Unpin;

fn check_unpin<T: Unpin>() {}

fn main() {
    check_unpin::<String>();
    check_unpin::<i32>();
}
```

# Options
- [ ] A) The type is allocated exclusively in non-movable page memory
- [x] B) The type is safe to move in memory even after being pinned
- [ ] C) The type cannot be passed across asynchronous task boundaries
- [ ] D) The type requires manual heap deallocation via raw pointers

# Hint
Almost all types in Rust implement Unpin automatically unless explicitly opted out.

# Explanation
`Unpin` indicates that pinning has no effect: instances can be safely moved out of `Pin` wrappers because they contain no self-referential pointers.
