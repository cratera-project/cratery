---
id: ptr-arc-mutex-1
categorySlug: pointers
title: "Arc Mutex Pattern"
difficulty: 2
tags: [pointers, arc, mutex]
---

# Prompt
Why is `Arc<Mutex<T>>` a common combo?

# Code
```rust
use std::sync::{Arc, Mutex};
let data = Arc::new(Mutex::new(0));
let d2 = Arc::clone(&data);
```

# Options
- [ ] A) `Mutex` shares ownership; `Arc` provides the lock key
- [x] B) `Arc` shares across threads; `Mutex` guards mutation
- [ ] C) Together they make interior borrows compile-time only
- [ ] D) `Arc` replaces `Mutex` whenever `T` is already `Sync`

# Hint
Split shared ownership from synchronized mutation.

# Explanation
`Arc` gives thread-safe shared ownership of the mutex. `Mutex` provides synchronized exclusive access to `T`. You need both when multiple threads must mutate shared state.
