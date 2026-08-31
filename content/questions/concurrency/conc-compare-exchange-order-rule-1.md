---
id: conc-compare-exchange-order-rule-1
categorySlug: concurrency
title: "compare_exchange Ordering Rules"
difficulty: 3
tags: [concurrency, atomics, ordering]
---

# Prompt
Why is line X rejected at runtime with a panic?

# Code
```rust
use std::sync::atomic::{AtomicBool, Ordering};

fn main() {
    let lock = AtomicBool::new(false);
    let _ = lock.compare_exchange(
        false,
        true,
        Ordering::Acquire,
        Ordering::Release, // line X
    );
}
```

# Options
- [ ] A) AtomicBool only supports Relaxed and SeqCst orderings
- [ ] B) Failure orderings must always be strictly SeqCst level
- [ ] C) Acquire and Release cannot be used on the same instance
- [x] D) Failure ordering cannot be Release or AcqRel in atomics

# Hint
What kind of memory operation occurs when compare_exchange fails?

# Explanation
In Rust's atomic `compare_exchange`, the failure ordering specifies the memory ordering for the load operation performed when the comparison fails. A failed `compare_exchange` only reads memory; it does not write or release any values. Therefore, the failure ordering cannot be `Release` or `AcqRel`, and cannot be stronger than the success ordering. Passing `Release` panics at runtime.
