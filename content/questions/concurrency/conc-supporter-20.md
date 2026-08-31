---
id: conc-supporter-20
categorySlug: concurrency
title: "SyncChannel Bounded Buffer"
difficulty: 2
tags: [concurrency, channels, sync-channel]
---

# Prompt
How does `std::sync::mpsc::sync_channel(bound)` behave when the buffer is full?

# Code
```rust
use std::sync::mpsc::sync_channel;

fn main() {
    let (tx, rx) = sync_channel::<i32>(2);
    tx.send(1).unwrap();
    tx.send(2).unwrap();
    // tx.send(3); // blocks until rx.recv()
}
```

# Options
- [x] A) `tx.send()` blocks the calling thread until a receiver consumes an item
- [ ] B) `tx.send()` discards older messages silently from the queue in runtime memory
- [ ] C) `tx.send()` panics immediately with a buffer overflow exception in runtime memory
- [ ] D) `tx.send()` returns `Err(BufferFullError)` without blocking in runtime memory

# Hint
sync_channel provides backpressure by blocking send when the bound is reached.

# Explanation
`sync_channel(bound)` creates a bounded channel. When the queue reaches capacity (`bound`), further calls to `tx.send(item)` block the sending thread until a receiver pulls an item with `recv()`.
