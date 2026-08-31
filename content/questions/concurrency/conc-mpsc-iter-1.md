---
id: conc-mpsc-iter-1
categorySlug: concurrency
title: "Receiver Iterator"
difficulty: 2
tags: [concurrency, channels]
---

# Prompt
What does `for msg in rx` do with an `mpsc` receiver?

# Code
```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel::<i32>();
    thread::spawn(move || {
        tx.send(1).unwrap();
        tx.send(2).unwrap();
    });
    for msg in rx {
        println!("{msg}");
    }
}
```

# Options
- [ ] A) It panics as soon as the channel has no waiting sender
- [ ] B) It busy-waits in a spin loop until messages arrive
- [ ] C) It yields `None` after each message for fairness
- [x] D) It blocks for messages and ends when all senders drop

# Hint
The iterator ends when the channel is disconnected.

# Explanation
`Receiver`'s iterator blocks waiting for the next message. When every `Sender`/`SyncSender` is dropped, the channel hangs up and the iterator ends with no panic and no spin loop.
