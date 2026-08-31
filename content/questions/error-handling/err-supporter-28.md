---
id: err-supporter-28
categorySlug: error-handling
title: "Result::as_ref Borrowing"
difficulty: 2
tags: [error-handling, as_ref, references]
---

# Prompt
What is the return type of `res.as_ref()` when `res` is `&Result<T, E>`?

# Code
```rust
struct IoError;

fn main() {
    let res: Result<String, IoError> = Ok(String::from("data"));
    let borrowed: Result<&String, &IoError> = res.as_ref();
    assert!(borrowed.is_ok());
}
```

# Options
- [x] A) `Result<&T, &E>`
- [ ] B) `&Result<T, E>`
- [ ] C) `Result<&T, E>`
- [ ] D) `Result<T, &E>`

# Hint
as_ref converts &Result<T, E> into Result<&T, &E>.

# Explanation
`Result::as_ref` converts `&Result<T, E>` into `Result<&T, &E>`, allowing matching or inspecting inner values by reference without moving `T` or `E`.
