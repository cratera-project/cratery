---
id: conc-supporter-23
categorySlug: concurrency
title: "Barrier Synchronization"
difficulty: 2
tags: [concurrency, barrier, coordination]
---

# Prompt
What happens when a thread calls `std::sync::Barrier::wait()`?

# Code
```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
    let barrier = Arc::new(Barrier::new(2));
    let c = Arc::clone(&barrier);
    thread::spawn(move || {
        c.wait();
    });
    barrier.wait();
}
```

# Options
- [ ] A) Signals a condition variable and terminates the calling thread in runtime memory
- [ ] B) Acquires exclusive write access to a shared memory pool in runtime memory
- [ ] C) Spawns background OS worker threads to balance CPU load in runtime memory
- [x] D) Blocks until the specified number of threads have all called `wait()`

# Hint
A Barrier blocks all calling threads until N threads have arrived.

# Explanation
A `Barrier` enables multiple threads to synchronize the beginning of some computation. Calling `barrier.wait()` blocks the thread until exactly `N` threads have called `wait()`, at which point all threads are released simultaneously.
