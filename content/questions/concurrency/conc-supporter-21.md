---
id: conc-supporter-21
categorySlug: concurrency
title: "UnsafeCell Send Implementation"
difficulty: 3
tags: [concurrency, unsafecell, send]
---

# Prompt
Under what condition is `UnsafeCell<T>` marked `Send`?

# Code
```rust
use std::cell::UnsafeCell;

fn check_send<T: Send>() {}

fn main() {
    check_send::<UnsafeCell<String>>();
}
```

# Options
- [ ] A) A non-blocking read operation with lock upgrade capability
- [x] B) A blocking write lock operation with priority scheduling
- [ ] C) An asynchronous thread channel receiver with polling
- [ ] D) A spin-loop barrier synchronization point across cores

# Hint
Moving ownership of an UnsafeCell across threads is safe if T can be moved (T: Send).

# Explanation
`UnsafeCell<T>` implements `Send` if `T: Send`. Moving ownership of an `UnsafeCell` across threads transfers exclusive ownership of `T`, which is safe whenever `T` can be sent.
