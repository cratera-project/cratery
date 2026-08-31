---
id: conc-supporter-2
categorySlug: concurrency
title: "compare_exchange_weak Spurious Failure"
difficulty: 3
tags: [concurrency, atomics, compare-exchange]
---

# Prompt
Why is `compare_exchange_weak` preferred in a retry loop on LL/SC architectures (ARM/RISC-V)?

# Code
```rust
use std::sync::atomic::{AtomicI32, Ordering};

fn add_atomic(val: &AtomicI32, n: i32) {
    let mut current = val.load(Ordering::Relaxed);
    while let Err(actual) = val.compare_exchange_weak(
        current,
        current + n,
        Ordering::Relaxed,
        Ordering::Relaxed,
    ) {
        current = actual;
    }
}
```

# Options
- [ ] A) It prevents memory allocations in the kernel scheduler under current compiler safety rules
- [ ] B) It executes in constant time regardless of thread count under current compiler safety rules
- [x] C) It generates faster load-linked/store-conditional instructions without extra retry loops
- [ ] D) It bypasses hardware cache coherence protocols completely under current compiler safety rules

# Hint
compare_exchange_weak can fail spuriously but avoids the overhead of an inner loop on LL/SC.

# Explanation
On Load-Linked/Store-Conditional architectures (ARM, RISC-V), `compare_exchange_weak` maps directly to single LL/SC pairs without wrapping them in an inner loop to handle spurious failures, making it faster when already inside a loop.
