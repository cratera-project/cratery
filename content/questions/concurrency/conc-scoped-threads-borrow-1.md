---
id: conc-scoped-threads-borrow-1
categorySlug: concurrency
title: "Scoped Threads Borrowing"
difficulty: 2
tags: [concurrency, threads, scope]
---

# Prompt
Why can the spawned thread borrow `numbers` without `'static` or `Arc`?

# Code
```rust
fn main() {
    let mut numbers = vec![1, 2, 3];
    std::thread::scope(|s| {
        s.spawn(|| {
            println!("len: {}", numbers.len());
        });
    });
    numbers.push(4);
    println!("final: {:?}", numbers);
}
```

# Options
- [x] A) thread::scope guarantees threads finish before scope exits
- [ ] B) s.spawn automatically clones numbers across thread boundaries
- [ ] C) Vec implements a lock-free internal pointer for all threads
- [ ] D) The compiler promotes stack references inside spawn to static

# Hint
What guarantee does thread::scope make about when spawned threads join?

# Explanation
`std::thread::scope` creates a scoped thread environment where all threads spawned via `s.spawn` are guaranteed to terminate and join before the scope closure returns. Because the threads cannot outlive the stack frame, they can safely borrow non-`'static` stack data without `Arc` or `Mutex`. Once the scope block finishes, exclusive access to `numbers` is restored.
