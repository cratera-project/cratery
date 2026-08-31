---
id: err-supporter-17
categorySlug: error-handling
title: "Custom Error with Display and Error Trait"
difficulty: 2
tags: [error-handling, error-trait, display]
---

# Prompt
Why must a custom error implement both `Display` and `Debug` to implement `std::error::Error`?

# Code
```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
struct MyError;

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "my error occurred")
    }
}

impl Error for MyError {}
```

# Options
- [ ] A) `Error` methods require string parsing via `Display` in runtime memory
- [x] B) `Display` and `Debug` are supertraits of `std::error::Error`
- [ ] C) The compiler generates panic unwinding glue via `Debug` in code
- [ ] D) Custom errors cannot be logged without implementing both in code

# Hint
pub trait Error: Debug + Display { ... } defines Debug and Display as supertraits.

# Explanation
`std::error::Error` has `Debug` and `Display` as supertraits (`pub trait Error: Debug + Display`). Implementing `Error` requires implementing `Debug` (for developer inspection) and `Display` (for user-facing error messages).
