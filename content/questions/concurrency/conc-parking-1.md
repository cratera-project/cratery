---
id: conc-parking-1
categorySlug: concurrency
title: "Thread Parking"
difficulty: 2
tags: [concurrency, threads]
---

# Prompt
What happens if this thread is never unparked?

# Code
```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        thread::park();
        println!("after park");
    });
    // no unpark
    handle.join().unwrap();
}
```

# Options
- [ ] A) `park` returns immediately and printing continues
- [ ] B) The parked thread panics after a short timeout
- [ ] C) The runtime wakes parked threads when memory is idle
- [x] D) `join` blocks forever waiting on the parked thread

# Hint
`park` waits for a matching `unpark` (or a prior park token).

# Explanation
`thread::park` blocks until the thread is unparked (or already has a park token). With no `unpark` and `main` blocked in `join`, the program hangs. Prefer channels or `Condvar` for most coordination.
