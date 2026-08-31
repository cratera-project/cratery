---
id: conc-channel-drop-1
categorySlug: concurrency
title: "Channel Disconnect"
difficulty: 2
tags: [concurrency, channels]
---

# Prompt
What happens when all `Sender`s are dropped?

# Code
```rust
use std::sync::mpsc;
let (tx, rx) = mpsc::channel::<i32>();
drop(tx);
let msg = rx.recv();
```

# Options
- [x] A) `recv` returns `Err`, signaling a disconnected channel
- [ ] B) `recv` blocks forever waiting for a replacement sender
- [ ] C) `recv` panics because empty channels are invalid state
- [ ] D) `recv` invents a default `i32` and returns `Ok(0)`

# Hint
No producers left means the stream is finished.

# Explanation
When every `Sender` is dropped, `recv` unblocks with `Err(RecvError)` so consumers can stop cleanly. It does not hang forever or fabricate values.
