---
id: conc-supporter-9
categorySlug: concurrency
title: "Arc vs Rc Thread Safety"
difficulty: 2
tags: [concurrency, arc, rc]
---

# Prompt
Why does `std::sync::Arc` implement `Send` and `Sync` while `std::rc::Rc` does not?

# Code
```rust
use std::sync::Arc;

fn main() {
    let data = Arc::new(100);
    let clone = Arc::clone(&data);
    std::thread::spawn(move || {
        println!("{clone}");
    }).join().unwrap();
}
```

# Options
- [ ] A) `Arc` allocates memory in the operating system kernel heap space in code
- [x] B) `Arc` uses atomic CPU instructions to update its reference counts
- [ ] C) `Rc` uses mutex locks which are forbidden across thread boundaries
- [ ] D) `Arc` creates deep clones of contained data whenever spawned in code

# Hint
Arc stands for Atomically Reference Counted.

# Explanation
`Arc` ("Atomic Reference Counted") uses atomic fetch-add and fetch-sub instructions to safely update its reference count from multiple threads concurrently, whereas `Rc` uses non-atomic arithmetic and is not thread-safe.
