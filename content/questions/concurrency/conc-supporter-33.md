---
id: conc-supporter-33
categorySlug: concurrency
title: "Thread Park and Unpark"
difficulty: 2
tags: [concurrency, threads, park]
---

# Prompt
How do `std::thread::park()` and `thread::unpark()` coordinate threads?

# Code
```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        thread::park();
        println!("unparked!");
    });
    thread::sleep(Duration::from_millis(10));
    handle.thread().unpark();
    handle.join().unwrap();
}
```

# Options
- [ ] A) `park` saves thread registers to disk storage for later resumption within local thread memory
- [x] B) `park` suspends the current thread until another thread calls `unpark` on its handle
- [ ] C) `unpark` forces immediate termination of the target thread handle within local thread memory
- [ ] D) `park` causes the thread to continuously poll CPU in a busy loop within local thread memory

# Hint
Thread parking allows efficient low-level thread sleeping and waking.

# Explanation
`std::thread::park()` blocks the current thread until its token is made available via `handle.thread().unpark()`. Unpark tokens are saturated (at most 1), avoiding lost wakeups if `unpark` is called before `park`.
