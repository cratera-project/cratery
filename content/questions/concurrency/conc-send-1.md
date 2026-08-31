---
id: conc-send-1
categorySlug: concurrency
title: "Send Trait"
difficulty: 3
tags: [concurrency, traits, send]
---

# Prompt
What does the `Send` bound on `T` allow here?

# Code
```rust
use std::thread;

fn run_job<T>(job: T)
where
    T: Send + 'static,
{
    thread::spawn(move || {
        let _ = job;
    });
}
```

# Options
- [x] A) Transfer of ownership of `T` into another thread
- [ ] B) Safe concurrent access through shared references only
- [ ] C) Guaranteed immutability for the life of the job
- [ ] D) Automatic heap allocation of `T` before the spawn

# Hint
Do not confuse `Send` with `Sync`.

# Explanation
`Send` means it is safe to move ownership of a value to another thread. `Sync` is about sharing `&T` across threads. Types like `Rc<T>` are not `Send` because their refcounts are not atomic.
