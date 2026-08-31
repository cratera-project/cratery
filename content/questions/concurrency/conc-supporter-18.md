---
id: conc-supporter-18
categorySlug: concurrency
title: "std::hint::spin_loop Utility"
difficulty: 2
tags: [concurrency, spin-loop, cpu]
---

# Prompt
What is the purpose of calling `std::hint::spin_loop()` in busy-wait loops?

# Code
```rust
use std::sync::atomic::{AtomicBool, Ordering};

fn spin(flag: &AtomicBool) {
    while !flag.load(Ordering::Relaxed) {
        std::hint::spin_loop();
    }
}
```

# Options
- [ ] A) Forces the OS kernel to preempt the thread immediately within local thread memory
- [ ] B) Flushes all L1 and L2 CPU caches to main RAM memory within local thread memory
- [x] C) Emits a CPU pause instruction to optimize power and pipeline performance
- [ ] D) Allocates a temporary mutex lock in user space during runtime execution in code

# Hint
spin_loop emits a CPU pause (e.g. PAUSE on x86, YIELD on ARM) to reduce pipeline stalls.

# Explanation
`std::hint::spin_loop()` emits processor-specific spin-wait hints (such as `PAUSE` on x86 or `YIELD` on ARM), preventing memory order violation pipeline stalls and saving CPU power.
