---
id: conc-supporter-4
categorySlug: concurrency
title: "Mutex Poisoning and Recovery"
difficulty: 2
tags: [concurrency, mutex, poisoning]
---

# Prompt
What happens when a thread holding a `std::sync::Mutex` panics?

# Code
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(42);
    let guard = m.lock().unwrap();
    println!("{}", *guard);
}
```

# Options
- [x] A) The Mutex becomes poisoned, returning `Err(PoisonError)` to future lock callers
- [ ] B) The Mutex deadlocks permanently and halts the operating system process in runtime memory
- [ ] C) The inner value is reset to its Default implementation automatically in runtime memory
- [ ] D) The panic is propagated immediately to all waiting listener threads in runtime memory

# Hint
Panic while holding a lock poisons the mutex.

# Explanation
If a thread holding a `MutexGuard` panics, the `Mutex` is flagged as poisoned. Future calls to `lock()` return `Err(PoisonError<MutexGuard>)`, allowing other threads to detect potentially inconsistent state or recover via `into_inner()`.
