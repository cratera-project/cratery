---
id: conc-join-1
categorySlug: concurrency
title: "Join Handle Results"
difficulty: 2
tags: [concurrency, threads]
---

# Prompt
What does `JoinHandle::join` return on success?

# Code
```rust
use std::thread;
let handle = thread::spawn(|| 7);
let n = handle.join().unwrap();
```

# Options
- [ ] A) Always `()` because threads cannot return values
- [ ] B) A borrowed reference into the child thread’s stack
- [x] C) `Ok` holding the closure’s return value
- [ ] D) The child thread’s OS pid wrapped in a `Mutex`

# Hint
The handle carries the closure’s output type.

# Explanation
`join` waits for the thread and returns `Result<T, _>` where `T` is the closure’s return type. Panic in the child becomes `Err`. It does not borrow the child’s stack.
