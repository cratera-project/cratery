---
id: conc-poisoned-1
categorySlug: concurrency
title: "Poisoned Mutex"
difficulty: 3
tags: [concurrency, mutex, panics]
---

# Prompt
When does a later `lock()` return `Err(PoisonError)`?

# Code
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let lock = Arc::new(Mutex::new(0));
    let lock2 = Arc::clone(&lock);
    let _ = thread::spawn(move || {
        let mut n = lock2.lock().unwrap();
        *n += 1;
        panic!("boom");
    })
    .join();
    println!("{:?}", lock.lock().is_err());
}
```

# Options
- [ ] A) When a thread holds the lock longer than a timeout
- [ ] B) When two threads contend for the same mutex
- [ ] C) When `unlock` is called twice on the same guard
- [x] D) When a thread panics while still holding the lock

# Hint
Poisoning marks that protected data may be inconsistent.

# Explanation
If a thread panics while holding a `Mutex`, the mutex is poisoned. Later `lock()` calls return `Err(PoisonError<_>)` so callers can decide whether to recover with `into_inner` or propagate failure.
