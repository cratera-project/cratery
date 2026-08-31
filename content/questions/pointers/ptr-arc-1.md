---
id: ptr-arc-1
categorySlug: pointers
title: "Arc Meaning"
difficulty: 2
tags: [pointers, arc]
---

# Prompt
What is `Arc<T>` primarily for?

# Code
```rust
use std::sync::Arc;
let a = Arc::new(vec![1, 2, 3]);
let b = Arc::clone(&a);
```

# Options
- [ ] A) Faster heap allocation than `Box` for large values
- [x] B) Thread-safe shared ownership across threads
- [ ] C) Exclusive move-only ownership for concurrency
- [ ] D) Interior mutability without any synchronization

# Hint
`Arc` = atomically reference counted.

# Explanation
`Arc<T>` is a thread-safe reference-counted pointer for shared ownership across threads. Mutation of the inner data still needs something like `Mutex`/`RwLock` unless the data is immutable.
