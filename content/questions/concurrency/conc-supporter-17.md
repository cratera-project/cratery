---
id: conc-supporter-17
categorySlug: concurrency
title: "Spinlock Memory Ordering"
difficulty: 3
tags: [concurrency, atomics, spinlock]
---

# Prompt
What ordering should be used for locking a spinlock with `swap` and unlocking with `store`?

# Code
```rust
use std::sync::atomic::{AtomicBool, Ordering};

struct SpinLock(AtomicBool);

impl SpinLock {
    fn lock(&self) {
        while self.0.swap(true, Ordering::Acquire) {
            std::hint::spin_loop();
        }
    }
    fn unlock(&self) {
        self.0.store(false, Ordering::Release);
    }
}
```

# Options
- [ ] A) `Relaxed` on lock acquisition, `SeqCst` on lock release in code
- [x] B) `Acquire` on lock acquisition, `Release` on lock release
- [ ] C) `Release` on lock acquisition, `Acquire` on lock release
- [ ] D) `Relaxed` for both acquisition and release operations in code

# Hint
Locking acquires access (Acquire); unlocking releases modifications (Release).

# Explanation
Acquiring the lock requires `Ordering::Acquire` so subsequent critical section memory operations cannot be reordered before the lock. Releasing requires `Ordering::Release` so critical section writes become visible.
