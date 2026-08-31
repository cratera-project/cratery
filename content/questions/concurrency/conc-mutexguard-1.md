---
id: conc-mutexguard-1
categorySlug: concurrency
title: "MutexGuard Lifetime"
difficulty: 2
tags: [concurrency, mutex]
---

# Prompt
When is this mutex unlocked?

# Code
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(123);
    {
        let guard = m.lock().unwrap();
        println!("{}", *guard);
    } // ?
}
```

# Options
- [ ] A) Only when the `Mutex` value itself is dropped
- [ ] B) Only when the owning thread finishes completely
- [x] C) When the `MutexGuard` is dropped at end of scope
- [ ] D) Immediately after the first read through the guard

# Hint
RAII: the lock lives as long as the guard value.

# Explanation
`lock()` returns a `MutexGuard`. The mutex stays locked until that guard is dropped: end of scope or an explicit `drop(guard)`. Reading through the guard does not unlock early.
