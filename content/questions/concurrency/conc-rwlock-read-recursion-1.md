---
id: conc-rwlock-read-recursion-1
categorySlug: concurrency
title: "RwLock Read Reentrancy"
difficulty: 2
tags: [concurrency, rwlock, synchronization]
---

# Prompt
What happens when this code executes?

# Code
```rust
use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(5);
    let r1 = lock.read().unwrap();
    let r2 = lock.read().unwrap();
    println!("{}", *r1 + *r2);
}
```

# Options
- [ ] A) It panics because read locks cannot be acquired twice
- [x] B) It prints 10 because multiple shared reads are allowed
- [ ] C) It deadlocks unconditionally on the second read() call
- [ ] D) It fails to compile because r1 holds exclusive access

# Hint
Does RwLock permit multiple concurrent readers?

# Explanation
`std::sync::RwLock` allows multiple concurrent read locks as long as no writer holds or waits for an exclusive lock. Here, both `r1` and `r2` obtain shared access on the same thread without issue, and `*r1 + *r2` evaluates to 10. Note that recursive read locks can still deadlock if another thread queues a pending write lock in between.
