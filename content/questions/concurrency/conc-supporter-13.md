---
id: conc-supporter-13
categorySlug: concurrency
title: "Cell and RefCell !Sync"
difficulty: 2
tags: [concurrency, cell, sync]
---

# Prompt
Why are `Cell<T>` and `RefCell<T>` not `Sync` (`!Sync`)?

# Code
```rust
use std::cell::Cell;

fn main() {
    let c = Cell::new(42);
    c.set(43);
    println!("{}", c.get());
}
```

# Options
- [ ] A) They use heap allocation mechanisms that are local to the OS process
- [x] B) They allow mutation through `&self` without thread synchronization
- [ ] C) They contain raw pointers that cannot be formatted with Display in code
- [ ] D) They disable compiler optimizations across thread barriers in runtime memory

# Hint
Interior mutability without atomic synchronization is not thread-safe.

# Explanation
`Cell` and `RefCell` provide interior mutability via shared references (`&Cell<T>`) without using atomic operations or mutexes. Sharing `&Cell<T>` across multiple threads would cause unsynchronized concurrent writes (data races).
