---
id: conc-thread-local-1
categorySlug: concurrency
title: "Thread Local Storage"
difficulty: 3
tags: [concurrency, threads, tls]
---

# Prompt
What does the spawned thread print?

# Code
```rust
use std::cell::Cell;
use std::thread;

thread_local! {
    static COUNTER: Cell<u32> = Cell::new(0);
}

fn main() {
    COUNTER.with(|c| c.set(5));
    let h = thread::spawn(|| {
        COUNTER.with(|c| println!("{}", c.get()));
    });
    h.join().unwrap();
}
```

# Options
- [ ] A) `5`, inherited from the main thread's cell
- [x] B) `0`, from a fresh cell for that thread
- [ ] C) It panics because TLS cannot cross thread::spawn
- [ ] D) An arbitrary value from an unsynchronized race

# Hint
Each thread initializes its own TLS instance.

# Explanation
`thread_local!` gives each thread a separate `COUNTER`. Setting it in `main` does not affect the spawned thread, which still starts at `0`. There is no data race; the cells are distinct.
