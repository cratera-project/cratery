---
id: err-supporter-4
categorySlug: error-handling
title: "std::error::Error Source Trait Method"
difficulty: 2
tags: [error-handling, source, error-trait]
---

# Prompt
What does the `Error::source(&self)` method return?

# Code
```rust
use std::error::Error;

fn print_chain(mut err: &dyn Error) {
    println!("Error: {err}");
    while let Some(cause) = err.source() {
        println!("Caused by: {cause}");
        err = cause;
    }
}
```

# Options
- [x] A) `Option<&(dyn Error + 'static)>` pointing to the underlying lower-level cause
- [ ] B) `Option<Box<dyn Error>>` containing a heap clone of the previous error in runtime memory
- [ ] C) `&str` representing the file name where the error originated within local thread memory
- [ ] D) `Option<Backtrace>` containing CPU instruction pointers within local thread memory

# Hint
Error::source returns an optional reference to the lower-level source error in the chain.

# Explanation
`Error::source(&self)` returns `Option<&(dyn Error + 'static)>`, allowing consumers to walk up the causal error chain from high-level errors to low-level root causes.
