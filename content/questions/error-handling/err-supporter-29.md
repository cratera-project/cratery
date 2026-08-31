---
id: err-supporter-29
categorySlug: error-handling
title: "std::panic::Location Information"
difficulty: 2
tags: [error-handling, track-caller, location]
---

# Prompt
What source code information is provided by `std::panic::Location::caller()`?

# Code
```rust
#[track_caller]
fn check_positive(x: i32) {
    if x < 0 {
        let loc = std::panic::Location::caller();
        println!("called from {}:{}:{}", loc.file(), loc.line(), loc.column());
    }
}
```

# Options
- [ ] A) The CPU instruction pointer and memory address in the binary in code
- [x] B) The source file name, line number, and column number of the caller
- [ ] C) The network IP address of the calling client node during runtime execution
- [ ] D) The operating system process identifier and thread ID in runtime memory

# Hint
Location::caller() paired with #[track_caller] yields file, line, and column info.

# Explanation
`#[track_caller]` enables `std::panic::Location::caller()` to retrieve the exact source file, line number, and column number of the function's call site.
