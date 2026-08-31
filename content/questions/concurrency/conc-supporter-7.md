---
id: conc-supporter-7
categorySlug: concurrency
title: "Condvar Spurious Wakeups"
difficulty: 2
tags: [concurrency, condvar, synchronization]
---

# Prompt
Why must `Condvar::wait` always be called inside a `while` loop condition check?

# Code
```rust
use std::sync::{Condvar, Mutex};

fn wait_for_ready(pair: &(Mutex<bool>, Condvar)) {
    let (lock, cvar) = pair;
    let mut ready = lock.lock().unwrap();
    while !*ready {
        ready = cvar.wait(ready).unwrap();
    }
}
```

# Options
- [ ] A) Condvar unlocks the mutex only after the while loop body completes in runtime memory
- [ ] B) The compiler disables loop unrolling optimization for condition checks in runtime memory
- [ ] C) Thread identifiers are recycled and must be verified on each wakeup in runtime memory
- [x] D) The operating system can wake waiting threads spuriously without notification

# Hint
OS condvars can wake up spuriously without notify being called.

# Explanation
Condition variables can wake up spuriously (without any thread calling `notify_one` or `notify_all`) due to operating system scheduling details. The predicate condition must always be rechecked in a `while` loop.
