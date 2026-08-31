---
id: ptr-mutex-1
categorySlug: pointers
title: "Mutex Lock Guard"
difficulty: 3
tags: [pointers, mutex, sync]
---

# Prompt
Why does `Mutex::lock` return a guard instead of `&mut T`?

# Code
```rust
use std::sync::Mutex;
let m = Mutex::new(0);
let mut guard = m.lock().unwrap();
*guard += 1;
```

# Options
- [ ] A) Safe Rust cannot return references from methods
- [ ] B) `&mut T` is never allowed behind shared owners
- [ ] C) Locking moves `T` out of the mutex permanently
- [x] D) The guard ties unlock to drop (RAII lifetime)

# Hint
When the guard drops, the lock is released.

# Explanation
The mutex guard represents “lock held.” When it drops, it unlocks. Returning a bare `&mut T` would not automatically release the lock or tie the borrow to the critical section.
