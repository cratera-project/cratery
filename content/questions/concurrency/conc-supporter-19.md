---
id: conc-supporter-19
categorySlug: concurrency
title: "Mutex Deadlock Self-Locking"
difficulty: 2
tags: [concurrency, mutex, deadlock]
---

# Prompt
What happens when a thread attempts to call `lock()` on a `std::sync::Mutex` it already holds?

# Code
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(10);
    let _g1 = m.lock().unwrap();
    // let _g2 = m.lock().unwrap(); // deadlocks
}
```

# Options
- [ ] A) The Mutex increments its internal recursion depth counter in runtime memory
- [ ] B) The second lock call returns `Err(AlreadyLockedError)` in runtime memory
- [ ] C) The first lock is dropped automatically and replaced by the second in code
- [x] D) The thread deadlocks waiting on itself because Mutex is non-reentrant

# Hint
Rust's standard Mutex is not reentrant.

# Explanation
Standard `std::sync::Mutex` is non-reentrant. Attempting to acquire the lock a second time from the same thread causes a permanent deadlock waiting for itself to release the lock.
