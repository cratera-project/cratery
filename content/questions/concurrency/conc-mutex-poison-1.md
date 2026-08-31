---
id: conc-mutex-poison-1
categorySlug: concurrency
title: "Mutex Poisoning"
difficulty: 2
tags: [concurrency, mutex]
---

# Prompt
When does `Mutex::lock` return `Err`?

# Code
```rust
use std::sync::{Arc, Mutex};
use std::thread;

let m = Arc::new(Mutex::new(0));
let m2 = Arc::clone(&m);
let _ = thread::spawn(move || {
    let _g = m2.lock().unwrap();
    panic!("boom");
}).join();
let result = m.lock();
```

# Options
- [ ] A) Whenever another thread currently holds the mutex
- [ ] B) Only if you call `lock` twice on the same thread
- [ ] C) Never; `lock` always returns `Ok` on stable Rust
- [x] D) After a holder panics before releasing the mutex

# Hint
Poison flags “previous holder panicked.”

# Explanation
If a thread panics while holding a `MutexGuard`, the mutex becomes poisoned. Later `lock` calls return `Err(PoisonError<_>)` so you can decide whether to recover with `into_inner` or propagate.
