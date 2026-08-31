---
id: conc-channel-disconnection-hang-1
categorySlug: concurrency
title: "MPSC Channel Disconnection Behavior"
difficulty: 1
tags: [concurrency, channels, mpsc]
---

# Prompt
What happens when calling `rx.recv()` on a channel after all `Sender` instances have been dropped?

# Options
- [x] A) rx.recv() returns Err(RecvError) when all senders drop
- [ ] B) rx.recv() hangs forever waiting for fresh message data
- [ ] C) rx.recv() panics dynamically at runtime upon channel end
- [ ] D) rx.recv() creates a new Sender channel handle in thread

# Hint
When all senders are dropped and buffer is empty, recv() unblocks and returns Err(RecvError).

# Explanation
When all `Sender` handles have dropped and the queue is empty, `rx.recv()` returns `Err(RecvError)`, indicating the channel is disconnected.
