---
id: conc-supporter-15
categorySlug: concurrency
title: "thread_local! Initialization Timing"
difficulty: 2
tags: [concurrency, thread-local, initialization]
---

# Prompt
When is a `thread_local!` variable initialized?

# Code
```rust
use std::cell::Cell;

thread_local! {
    static COUNTER: Cell<u32> = const { Cell::new(1) };
}

fn main() {
    COUNTER.with(|c| {
        println!("{}", c.get());
    });
}
```

# Options
- [ ] A) Eagerly when the main application binary is launched
- [ ] B) During compilation and baked into read-only binary text
- [ ] C) When the thread exits and terminates its stack frame
- [x] D) Lazily upon first access by each respective thread

# Hint
Thread local variables initialize lazily when first accessed via .with().

# Explanation
`thread_local!` static variables are initialized lazily per-thread the first time that specific thread accesses the variable using `.with(...)`. Each thread maintains its own independent copy.
