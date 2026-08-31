---
id: conc-supporter-26
categorySlug: concurrency
title: "Arc Weak Downgrade"
difficulty: 2
tags: [concurrency, arc, weak]
---

# Prompt
What is the purpose of `Arc::downgrade`?

# Code
```rust
use std::sync::{Arc, Weak};

fn main() {
    let strong = Arc::new(10);
    let weak: Weak<i32> = Arc::downgrade(&strong);
    assert!(weak.upgrade().is_some());
}
```

# Options
- [ ] A) Converts an atomic Arc into a thread-local single-threaded Rc in runtime memory
- [ ] B) Demotes the priority of the thread accessing the shared resource in runtime memory
- [x] C) Creates a non-owning `Weak` reference to prevent circular reference leaks
- [ ] D) Releases memory back to the operating system heap immediately in runtime memory

# Hint
Weak references do not prevent the inner value from being dropped.

# Explanation
`Arc::downgrade` creates a `Weak<T>` pointer that tracks reference counts without preventing the inner value from being dropped when all `Arc` instances go out of scope, preventing memory cycles.
