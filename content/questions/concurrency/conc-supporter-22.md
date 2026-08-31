---
id: conc-supporter-22
categorySlug: concurrency
title: "Atomic Pointer Ordering"
difficulty: 2
tags: [concurrency, atomic-ptr, raw-pointers]
---

# Prompt
What atomic type is used for atomic raw pointer operations?

# Code
```rust
use std::sync::atomic::{AtomicPtr, Ordering};

fn main() {
    let mut val = 42;
    let ptr = AtomicPtr::new(&mut val);
    let loaded = ptr.load(Ordering::Acquire);
    assert!(!loaded.is_null());
}
```

# Options
- [ ] A) The lock remains acquired until the guard goes out of scope
- [ ] B) The lock is released immediately after the closure returns
- [x] C) The lock is transferred to the operating system kernel mutex
- [ ] D) The lock is cloned into all child background worker threads

# Hint
AtomicPtr<T> provides atomic operations on raw mutable pointers *mut T.

# Explanation
`std::sync::atomic::AtomicPtr<T>` provides atomic load, store, swap, and compare-and-swap operations on `*mut T` pointers across threads.
