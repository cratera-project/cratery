---
id: err-custom-types-1
categorySlug: error-handling
title: "Custom Error Types"
difficulty: 3
tags: [error-handling, types]
---

# Prompt
Why define a custom error enum wrapping I/O and parse errors?

# Code
```rust
enum MyError {
    Io(std::io::Error),
    Parse(serde_json::Error),
    InvalidConfig(String),
}
```

# Options
- [ ] A) Because custom enums always beat `io::Error` on speed
- [ ] B) Because `std::io::Error` cannot leave library functions
- [ ] C) To avoid depending on any standard library error types
- [x] D) To unify failure modes under one typed API surface

# Hint
Callers match on domain failures, not every underlying crate.

# Explanation
A library error type can represent every failure mode you expose, often with `From` impls (or `thiserror`) for ergonomic `?`. `io::Error` can be returned, but it cannot express parse/config variants cleanly by itself.
