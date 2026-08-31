---
id: err-supporter-14
categorySlug: error-handling
title: "std::process::Termination Trait in Main"
difficulty: 2
tags: [error-handling, termination, main]
---

# Prompt
Why can `fn main() -> Result<(), Box<dyn Error>>` return an error directly?

# Code
```rust
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let _num: u32 = "123".parse()?;
    Ok(())
}
```

# Options
- [ ] A) The compiler unwinds the stack automatically when main exits in runtime memory
- [ ] B) All main functions in Rust are macros that wrap code in try-catch in runtime memory
- [x] C) `Result` implements the `std::process::Termination` trait for main returns
- [ ] D) The operating system kernel directly inspects Rust Result types in runtime memory

# Hint
The Termination trait defines how main exit codes are reported to the OS.

# Explanation
`main` can return any type that implements `std::process::Termination`. `Result<(), E>` implements `Termination`, returning exit code `0` on `Ok(())` and printing the error and exiting with code `1` on `Err(e)`.
