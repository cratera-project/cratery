---
id: err-supporter-7
categorySlug: error-handling
title: "std::backtrace::Backtrace Capture"
difficulty: 2
tags: [error-handling, backtrace, diagnostics]
---

# Prompt
How is a backtrace captured during error construction in modern Rust?

# Code
```rust
use std::backtrace::Backtrace;

struct CustomError {
    message: String,
    backtrace: Backtrace,
}

fn make_error() -> CustomError {
    CustomError {
        message: String::from("fail"),
        backtrace: Backtrace::capture(),
    }
}
```

# Options
- [ ] A) `Backtrace::new()` triggers an immediate stack unwinding exception in runtime memory
- [ ] B) `Backtrace::force()` allocates a new thread with register logging in runtime memory
- [ ] C) `Backtrace::dump()` serializes stack frames directly to stderr in runtime memory
- [x] D) `Backtrace::capture()` records the call stack if `RUST_BACKTRACE` is enabled

# Hint
Backtrace::capture() captures the current stack trace if enabled in the environment.

# Explanation
`Backtrace::capture()` captures the current execution stack frames if backtrace capture is enabled by environment variables (e.g. `RUST_BACKTRACE=1` or `RUST_LIB_BACKTRACE=1`). To force capture unconditionally, use `Backtrace::force_capture()`.
