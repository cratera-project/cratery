---
id: conc-once-1
categorySlug: concurrency
title: "Once Initialization"
difficulty: 2
tags: [concurrency, initialization]
---

# Prompt
What does a successful `Once::call_once` guarantee?

# Code
```rust
use std::sync::Once;
use std::thread;

static INIT: Once = Once::new();

fn main() {
    let mut handles = vec![];
    for _ in 0..4 {
        handles.push(thread::spawn(|| {
            INIT.call_once(|| {
                // init work
            });
        }));
    }
    for h in handles {
        h.join().unwrap();
    }
}
```

# Options
- [x] A) The closure body runs at most once across all threads
- [ ] B) The closure body runs once separately on each thread
- [ ] C) The closure body always runs on the main thread only
- [ ] D) The closure body may finish successfully multiple times

# Hint
`Once` is a one-shot initialization latch shared by threads.

# Explanation
After a successful `call_once`, the closure does not run again; other callers wait for completion then proceed. Prefer `OnceLock`/`LazyLock` for storing an initialized value. A panic during init poisons the `Once`.
