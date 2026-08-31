---
id: err-code-map-err
categorySlug: error-handling
title: "Transform Error Message"
difficulty: 2
tags: [error-handling, coding]
kind: coding
---

# Prompt
Implement `parse_id(s: &str) -> Result<u32, String>` that parses a string into a `u32`, mapping any `ParseIntError` into a `String` formatted as `"invalid id: {err}"`.

# Code
```rust
pub fn parse_id(s: &str) -> Result<u32, String> {
    s.parse::<u32>().map_err(|e| format!("invalid id: {e}"))
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(parse_id("100"), Ok(100));
    assert!(parse_id("-5").unwrap_err().starts_with("invalid id:"));
    println!("test passed");
}
```

# Explanation
Implement `parse_id(s: &str) -> Result<u32, String>` that parses a string into a `u32`, mapping any `ParseIntError` into a `String` formatted as `"invalid id: {err}"`. Review the test cases to verify all assertions.
