---
id: err-code-option-ok-or
categorySlug: error-handling
title: "Convert Option to Result"
difficulty: 1
tags: [error-handling, coding]
kind: coding
---

# Prompt
Implement `require_present<T>(opt: Option<T>, err_msg: &'static str) -> Result<T, &'static str>` using `.ok_or()`.

# Code
```rust
pub fn require_present<T>(opt: Option<T>, err_msg: &'static str) -> Result<T, &'static str> {
    opt.ok_or(err_msg)
}
```

# Solution
```rust
pub fn require_present<T>(opt: Option<T>, err_msg: &'static str) -> Result<T, &'static str> {
    opt.ok_or(err_msg)
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(require_present(Some(42), "missing"), Ok(42));
    assert_eq!(require_present::<i32>(None, "missing"), Err("missing"));
    println!("test passed");
}
```

# Explanation
Implement `require_present<T>(opt: Option<T>, err_msg: &'static str) -> Result<T, &'static str>` using `.ok_or()`. Review the test cases to verify all assertions.
