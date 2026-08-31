---
id: conc-supporter-11
categorySlug: concurrency
title: "mpsc Channel Disconnect on Drop"
difficulty: 2
tags: [concurrency, channels, mpsc]
---

# Prompt
What does `rx.recv()` return when all corresponding `Sender` handles have dropped?

# Code
```rust
use std::sync::mpsc::channel;

fn main() {
    let (tx, rx) = channel::<i32>();
    drop(tx);
    let result = rx.recv();
    assert!(result.is_err());
}
```

# Options
- [ ] A) Blocks the thread waiting for future sender connections in code
- [ ] B) `Ok(0)` returning the default value of the channel payload in code
- [ ] C) Panics immediately with a broken pipe system signal in runtime memory
- [x] D) `Err(RecvError)` signaling that the channel is disconnected

# Hint
When all senders are dropped, the channel disconnects and returns an error on recv.

# Explanation
When all `Sender` instances for an `mpsc` channel are dropped, the channel is closed. Any pending messages in the buffer are yielded first; once empty, `rx.recv()` returns `Err(RecvError)`.
