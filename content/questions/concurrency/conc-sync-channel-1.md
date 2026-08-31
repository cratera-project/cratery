---
id: conc-sync-channel-1
categorySlug: concurrency
title: "Bounded sync_channel"
difficulty: 2
tags: [concurrency, channels]
---

# Prompt
How does `sync_channel(1)` differ from `channel()`?

# Code
```rust
use std::sync::mpsc::sync_channel;
use std::thread;

fn main() {
    let (tx, rx) = sync_channel(1);
    tx.send(1).unwrap();
    thread::spawn(move || {
        tx.send(2).unwrap();
    });
    assert_eq!(rx.recv().unwrap(), 1);
    assert_eq!(rx.recv().unwrap(), 2);
}
```

# Options
- [ ] A) It allows any number of receivers, unlike `channel`
- [x] B) Sends block once the bounded buffer is full
- [ ] C) Messages may arrive in a different send order
- [ ] D) The sender cannot be cloned for extra producers

# Hint
The `1` is a buffer size, not a thread count.

# Explanation
`sync_channel(bound)` is a bounded channel: `send` returns immediately while space remains, then blocks until a `recv` frees a slot. `bound == 0` is a rendezvous channel. Order is still FIFO, `SyncSender` can be cloned, and there is still a single `Receiver`, like `channel()`.
