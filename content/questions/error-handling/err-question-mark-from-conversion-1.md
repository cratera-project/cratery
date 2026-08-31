---
id: err-question-mark-from-conversion-1
categorySlug: error-handling
title: "From Conversion with ? Operator"
difficulty: 2
tags: [error-handling, from, question-operator]
---

# Prompt
What is the result of executing `main()`?

# Code
```rust
#[derive(Debug, PartialEq)]
struct CustomError(String);

impl From<std::io::Error> for CustomError {
    fn from(err: std::io::Error) -> Self {
        CustomError(err.to_string())
    }
}

fn run() -> Result<(), CustomError> {
    let io_err = std::io::Error::other("read fail");
    Err(io_err)?;
    Ok(())
}

fn main() {
    println!("{:?}", run());
}
```

# Options
- [ ] A) Panics at runtime with an unhandled std::io::Error
- [x] B) Err(CustomError("read fail")) via From conversion
- [ ] C) Fails to compile because ? cannot change error type
- [ ] D) Ok(()) because ? ignores errors from Err expressions

# Hint
The ? operator automatically converts errors using a standard conversion trait.

# Explanation
When the `?` operator encounters an `Err(e)` value, it performs an early return with `Err(From::from(e))`. Because `CustomError` implements `From<std::io::Error>`, the compiler automatically transforms the I/O error into `CustomError`, returning `Err(CustomError("read fail"))`.
