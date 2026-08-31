---
id: conc-supporter-30
categorySlug: concurrency
title: "Thread Builder Stack Size"
difficulty: 2
tags: [concurrency, threads, stack-size]
---

# Prompt
How can you configure the stack size for a newly spawned OS thread in Rust?

# Code
```rust
use std::thread;

fn main() {
    let builder = thread::Builder::new().stack_size(4 * 1024 * 1024);
    let handler = builder.spawn(|| {
        println!("custom stack size");
    }).unwrap();
    handler.join().unwrap();
}
```

# Options
- [ ] A) By passing a size argument directly to `thread::spawn`
- [ ] B) By configuring the `RUST_STACK_SIZE` environment variable
- [x] C) Using `std::thread::Builder::new().stack_size(...)`
- [ ] D) Through the `#[stack(4096)]` compiler attribute on the closure

# Hint
std::thread::Builder allows configuring thread name and stack size.

# Explanation
`std::thread::Builder` provides fine-grained control over thread attributes, allowing callers to set the thread name (`name`) and stack size (`stack_size`) before spawning.
