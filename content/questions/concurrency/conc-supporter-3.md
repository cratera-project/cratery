---
id: conc-supporter-3
categorySlug: concurrency
title: "Scoped Threads Lifetime Guarantees"
difficulty: 2
tags: [concurrency, scoped-threads, lifetimes]
---

# Prompt
How do scoped threads (`std::thread::scope`) safely borrow non-'static local data?

# Code
```rust
use std::thread;

fn main() {
    let mut numbers = vec![1, 2, 3];
    thread::scope(|s| {
        s.spawn(|| {
            numbers.push(4);
        });
    });
    println!("{numbers:?}");
}
```

# Options
- [ ] A) The vector buffer is cloned and moved into thread-local storage in runtime memory
- [ ] B) The OS converts stack allocations into reference-counted heap pages in code
- [ ] C) The compiler disables context switching until all threads terminate in code
- [x] D) `scope` guarantees all spawned threads finish before the closure exits

# Hint
thread::scope joins all spawned threads before returning.

# Explanation
`thread::scope` joins all threads spawned within the scope before returning. This guarantees that all threads finish before the stack frame of the enclosing function is popped, making borrowing stack data 100% safe.
