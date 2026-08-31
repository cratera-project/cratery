---
id: conc-supporter-8
categorySlug: concurrency
title: "RwLock Reader-Writer Priority"
difficulty: 3
tags: [concurrency, rwlock, starvation]
---

# Prompt
What hazard can occur when multiple threads hold shared read locks on `RwLock`?

# Code
```rust
use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(0);
    let r1 = lock.read().unwrap();
    let r2 = lock.read().unwrap();
    println!("{} {}", *r1, *r2);
}
```

# Options
- [x] A) Writer starvation if incoming read locks continuously overlap in time
- [ ] B) Automatic deadlock upon attempting any subsequent read operation in code
- [ ] C) Heap corruption caused by parallel unsynchronized cache accesses in code
- [ ] D) The compiler demoting the RwLock into an unshared Cell object in runtime memory

# Hint
Continuous streams of read locks can prevent writers from ever acquiring the lock.

# Explanation
If reader threads acquire shared locks in an overlapping fashion, writer threads attempting to acquire an exclusive lock may be starved indefinitely ("writer starvation") depending on the OS scheduler and lock implementation.
