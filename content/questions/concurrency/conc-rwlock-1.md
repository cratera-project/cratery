---
id: conc-rwlock-1
categorySlug: concurrency
title: "RwLock Semantics"
difficulty: 2
tags: [concurrency, rwlock]
---

# Prompt
What capability does `RwLock` add compared with `Mutex`?

# Code
```rust
use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(5);
    let _r1 = lock.read().unwrap();
    let _r2 = lock.read().unwrap();
}
```

# Options
- [ ] A) It synchronizes access across separate processes
- [ ] B) It makes deadlock impossible by design alone
- [x] C) Many readers may hold the lock; writers are exclusive
- [ ] D) All reads become lock-free atomic loads always

# Hint
Look at how many simultaneous `read()` guards are allowed.

# Explanation
`RwLock` allows multiple concurrent readers or one writer. `Mutex` always grants exclusive access, even for read-only use. Neither removes deadlock risk if lock order is wrong.
