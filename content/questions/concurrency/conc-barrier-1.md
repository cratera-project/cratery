---
id: conc-barrier-1
categorySlug: concurrency
title: "Barrier Synchronization"
difficulty: 2
tags: [concurrency, synchronization]
---

# Prompt
What does `Barrier::wait` guarantee for `N` participants?

# Code
```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
    let barrier = Arc::new(Barrier::new(3));
    let mut handles = vec![];
    for _ in 0..3 {
        let b = Arc::clone(&barrier);
        handles.push(thread::spawn(move || {
            b.wait();
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
}
```

# Options
- [ ] A) Waiting threads acquire locks in strict FIFO order
- [ ] B) Exactly one thread is chosen and the others exit early
- [ ] C) Each `wait` yields once, then continues immediately
- [x] D) No thread proceeds until all `N` threads have waited

# Hint
It is a rendezvous point, not a mutex.

# Explanation
A barrier blocks each caller of `wait` until `N` threads have arrived. Then all are released together. One thread's `BarrierWaitResult` reports `is_leader()`, but leadership is not the main guarantee.
