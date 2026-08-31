---
id: err-supporter-10
categorySlug: error-handling
title: "std::panic::set_hook Custom Panic Handler"
difficulty: 2
tags: [error-handling, panic-hook, diagnostics]
---

# Prompt
What does `std::panic::set_hook` configure?

# Code
```rust
use std::panic;

fn main() {
    panic::set_hook(Box::new(|info| {
        println!("Custom panic: {info}");
    }));
}
```

# Options
- [ ] A) A background thread that restarts failed asynchronous tasks in runtime memory
- [ ] B) A compiler plugin that detects panics during AST parsing in runtime memory
- [x] C) A custom global callback executed immediately whenever any panic occurs
- [ ] D) A hardware interrupt handler for divide-by-zero operations in runtime memory

# Hint
set_hook registers a custom panic hook called when panics happen before unwinding/aborting.

# Explanation
`std::panic::set_hook` sets a custom global panic hook that receives `&PanicHookInfo`. It executes before stack unwinding begins, allowing custom crash logging, Sentry reporting, or terminal cleanup.
