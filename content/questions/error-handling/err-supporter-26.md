---
id: err-supporter-26
categorySlug: error-handling
title: "Result::unwrap_err vs unwrap"
difficulty: 1
tags: [error-handling, unwrap_err, panics]
---

# Prompt
What happens when calling `res.unwrap_err()` on an `Ok` result?

# Code
```rust
fn main() {
    let res: Result<i32, &str> = Err("my error");
    let err = res.unwrap_err();
    assert_eq!(err, "my error");
}
```

# Options
- [ ] A) Returns `Default::default()` for the error type during runtime execution
- [ ] B) Converts the `Ok` value into a static string during runtime execution
- [x] C) Panics with the `Ok` value formatted in the panic message
- [ ] D) Returns `None` without terminating execution during runtime execution

# Hint
unwrap_err returns the error if Err, and panics if the result was Ok.

# Explanation
`Result::unwrap_err` extracts the `Err` value. If the result was actually `Ok(v)`, it panics with a message including the debug representation of `v`.
