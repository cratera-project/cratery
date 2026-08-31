---
id: conc-mpsc-clone-1
categorySlug: concurrency
title: "mpsc Cloning"
difficulty: 2
tags: [concurrency, channels]
---

# Prompt
Why can you `clone` an `mpsc::Sender` but not a `Receiver`?

# Code
```rust
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel::<i32>();
    let _tx2 = tx.clone();
    let _ = rx;
}
```

# Options
- [ ] A) Cloning a receiver would silently drop every message
- [ ] B) Receivers are constrained to run only on the main thread
- [x] C) The channel is MPSC: many senders, one receiver
- [ ] D) Senders implement `Copy`, so cloning is always free

# Hint
Expand the acronym in `mpsc`.

# Explanation
Standard library `mpsc` channels are multiple-producer, single-consumer. Cloning `Sender` supports extra producers; a single `Receiver` keeps consume-once semantics. `Sender` is `Clone`, not `Copy`.
