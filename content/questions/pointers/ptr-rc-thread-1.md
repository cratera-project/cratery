---
id: ptr-rc-thread-1
categorySlug: pointers
title: "Rc and Threads"
difficulty: 2
tags: [pointers, rc, send]
---

# Prompt
Why can’t you send an `Rc<T>` to another thread?

# Code
```rust
use std::rc::Rc;
use std::thread;

let data = Rc::new(5);
thread::spawn(move || {
    println!("{data}");
});
```

# Options
- [x] A) `Rc` is not `Send`; its counts aren’t atomic
- [ ] B) `Rc` cannot wrap integer types like `i32`
- [ ] C) `thread::spawn` forbids all heap allocations
- [ ] D) `move` closures cannot capture smart pointers

# Hint
Compare `Rc`’s counters with `Arc`’s.

# Explanation
`Rc` uses non-atomic reference counts and is neither `Send` nor `Sync`. Sharing across threads needs `Arc`, which uses atomic counting.
