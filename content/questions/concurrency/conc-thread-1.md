---
id: conc-thread-1
categorySlug: concurrency
title: "Thread Execution"
difficulty: 1
tags: [concurrency, threads]
---

# Prompt
Why is the print order of `"A"` and `"B"` unpredictable?

# Code
```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("A");
    });
    println!("B");
    handle.join().unwrap();
}
```

# Options
- [x] A) The OS scheduler decides when each thread runs
- [ ] B) Rust evaluates threads in nondeterministic source order
- [ ] C) `println!` queues output and flushes asynchronously
- [ ] D) The spawned thread is optimized away until `join`

# Hint
Spawning starts another OS thread; nothing pins print order before join.

# Explanation
Both threads are runnable concurrently. The OS scheduler chooses when each runs, so `"A"` may print before or after `"B"`. `join()` only waits for the spawned thread to finish; it does not fix relative ordering of earlier prints.
