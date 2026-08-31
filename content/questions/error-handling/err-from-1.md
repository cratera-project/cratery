---
id: err-from-1
categorySlug: error-handling
title: "From and the ? Operator"
difficulty: 2
tags: [error-handling, from, question-operator]
---

# Prompt
Why does `?` succeed converting `io::Error` into `MyError`?

# Code
```rust
use std::fs::File;
use std::io;

enum MyError {
    Io(io::Error),
}

impl From<io::Error> for MyError {
    fn from(e: io::Error) -> Self {
        MyError::Io(e)
    }
}

fn open() -> Result<File, MyError> {
    Ok(File::open("a.txt")?)
}
```

# Options
- [ ] A) `?` always erases errors into the unit type `()`
- [x] B) `From` lets `?` convert the error to the return type
- [ ] C) `File::open` already returns `Result<_, MyError>`
- [ ] D) `?` only works when both `Ok` payloads match exactly

# Hint
Look for a `From<SourceError> for DestError` impl.

# Explanation
`?` on `Result` returns early on `Err` after applying `From::from` to the error. That is how `io::Error` becomes `MyError` here. The `Ok` types still need to be compatible with the function's `Ok` type.
