---
id: err-supporter-1
categorySlug: error-handling
title: "The ? Operator and From Conversion"
difficulty: 2
tags: [error-handling, question-mark, from-trait]
---

# Prompt
What trait method is invoked when `?` converts an error type into the function return error type?

# Code
```rust
use std::io;

fn run() -> Result<(), io::Error> {
    let _s: u32 = "42".parse().map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))?;
    Ok(())
}
```

# Options
- [ ] A) `Into::into` converts the destination error into a string slice
- [x] B) `From::from` converts the source error into the return error type
- [ ] C) `TryFrom::try_from` parses the error code with fallback handling
- [ ] D) `Display::fmt` serializes the error message to console

# Hint
The ? operator automatically calls From::from on the error value.

# Explanation
When `?` encounters an `Err(e)`, it calls `From::from(e)` to convert the error into the return type's error variant before returning early with `return Err(From::from(e))`.
