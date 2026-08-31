---
id: conc-mutex-1
categorySlug: concurrency
title: "Mutex Sharing"
difficulty: 2
tags: [concurrency, mutex, arc]
---

# Prompt
Why wrap the `Mutex` in `Arc` before spawning?

# Code
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let c = Arc::clone(&counter);
    thread::spawn(move || {
        *c.lock().unwrap() += 1;
    })
    .join()
    .unwrap();
}
```

# Options
- [ ] A) `Arc` makes mutex lock and unlock operations faster
- [x] B) `Arc` shares ownership of one mutex across threads
- [ ] C) `Arc` is required because `Mutex` alone is not `Send`
- [ ] D) `Arc` replaces locking and prevents data races alone

# Hint
`Mutex` protects the data; something still has to own that mutex in each thread.

# Explanation
`Mutex<T>` is a single-owner value. `Arc` provides shared ownership of that mutex so each thread can hold a clone and lock the same guard. `Mutex` is already `Send`/`Sync` when `T: Send`; `Arc` is about ownership, not replacing the lock.
