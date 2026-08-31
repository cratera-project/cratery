---
id: conc-condvar-1
categorySlug: concurrency
title: "Condvar Wait"
difficulty: 3
tags: [concurrency, mutex, condvar]
---

# Prompt
What does `Condvar::wait` do with the mutex lock?

# Code
```rust
use std::sync::{Arc, Condvar, Mutex};
use std::thread;

fn main() {
    let pair = Arc::new((Mutex::new(false), Condvar::new()));
    let pair2 = Arc::clone(&pair);
    thread::spawn(move || {
        let (lock, cvar) = &*pair2;
        let mut ready = lock.lock().unwrap();
        *ready = true;
        cvar.notify_one();
    });
    let (lock, cvar) = &*pair;
    let mut ready = lock.lock().unwrap();
    while !*ready {
        ready = cvar.wait(ready).unwrap();
    }
}
```

# Options
- [ ] A) It keeps the mutex locked the whole time while waiting
- [ ] B) It unlocks forever and returns without locking again
- [x] C) It unlocks while waiting, then re-locks before return
- [ ] D) It sleeps without touching the mutex ownership at all

# Hint
Another thread must be able to take the lock and set the condition.

# Explanation
`wait` atomically releases the mutex and blocks. On wake it reacquires the lock and returns a new `MutexGuard`. That is why the `while !*ready` loop can recheck the condition safely. Spurious wakeups are why the loop is needed.
