---
id: conc-channel-1
categorySlug: concurrency
title: "Message Passing"
difficulty: 2
tags: [concurrency, channels]
---

# Prompt
After a successful `send` of a non-`Copy` value, who owns it?

# Code
```rust
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    let val = String::from("hi");
    tx.send(val).unwrap();
    // can we use val here?
    let got = rx.recv().unwrap();
    println!("{got}");
}
```

# Options
- [ ] A) Both ends share `val` through the channel buffer
- [ ] B) `val` is promoted to a `'static` allocation
- [ ] C) The sender keeps ownership; the receiver only borrows
- [x] D) Ownership moves to the receiver on a successful send

# Hint
Think of `send` like moving into a queue, not sharing.

# Explanation
For non-`Copy` types, `Sender::send` moves the value into the channel. The sender cannot use `val` afterward; `recv` gives ownership to the receiver. `Copy` types are copied instead.
