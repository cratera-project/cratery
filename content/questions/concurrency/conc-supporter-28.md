---
id: conc-supporter-28
categorySlug: concurrency
title: "Send Trait on MutexGuard"
difficulty: 3
tags: [concurrency, mutex-guard, send]
---

# Prompt
Why is `std::sync::MutexGuard` marked `!Send` on some platforms?

# Code
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(1);
    let guard = m.lock().unwrap();
    println!("{}", *guard);
}
```

# Options
- [x] A) Underlying OS primitives (like POSIX pthreads) require unlocks from the locking thread
- [ ] B) Mutex guards contain internal heap pointers that cannot be copied within local thread memory
- [ ] C) The compiler cannot generate drop glue for mutex guards across threads within local thread memory
- [ ] D) Mutex guards automatically poison the mutex when moved under current compiler safety rules

# Hint
POSIX pthread mutexes mandate that the thread that locked the mutex must be the one to unlock it.

# Explanation
Many operating systems (including POSIX pthread mutexes) mandate that a mutex must be unlocked by the exact same thread that locked it. Therefore, `MutexGuard` is `!Send` to prevent releasing the lock on a different thread.
