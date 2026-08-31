---
id: err-supporter-24
categorySlug: error-handling
title: "anyhow vs thiserror Roles"
difficulty: 2
tags: [error-handling, idioms, libraries]
---

# Prompt
What is the standard idiomatic distinction between `thiserror` and `anyhow` in Rust crates?

# Code
```rust
// thiserror for libraries; anyhow for application binaries
```

# Options
- [x] A) `thiserror` is for library structured errors; `anyhow` is for application binary error reporting
- [ ] B) `thiserror` is an async error handler; `anyhow` is synchronous only under current compiler safety rules
- [ ] C) `anyhow` requires manual unsafe pointer memory management during standard program runtime execution
- [ ] D) `thiserror` replaces standard library Result with custom enums under current compiler safety rules

# Hint
Libraries use thiserror to define clean, matchable error types; apps use anyhow for error context.

# Explanation
The established Rust ecosystem idiom is: libraries use `thiserror` to define strongly-typed, enum-based error types that callers can match on, while application binaries use `anyhow` for flexible context wrapping and backtrace printing.
