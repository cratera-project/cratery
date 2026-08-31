---
id: err-code-and-then-chain
categorySlug: error-handling
title: "Chain Result Functions with and_then"
difficulty: 2
tags: [error-handling, coding]
kind: coding
---

# Prompt
Implement `parse_and_reciprocal(s: &str) -> Result<f64, &'static str>` that parses `s` into `f64` (returning `Err("invalid number")` on error) and then returns `1.0 / val` (returning `Err("zero division")` if `val == 0.0`).

# Code
```rust
pub fn parse_and_reciprocal(s: &str) -> Result<f64, &'static str> {
    s.parse::<f64>()
        .map_err(|_| "invalid number")
        .and_then(|v| if v == 0.0 { Err("zero division") } else { Ok(1.0 / v) })
}
```

# Solution
```rust
pub fn parse_and_reciprocal(s: &str) -> Result<f64, &'static str> {
    s.parse::<f64>()
        .map_err(|_| "invalid number")
        .and_then(|v| if v == 0.0 { Err("zero division") } else { Ok(1.0 / v) })
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(parse_and_reciprocal("2.0"), Ok(0.5));
    assert_eq!(parse_and_reciprocal("0.0"), Err("zero division"));
    assert_eq!(parse_and_reciprocal("xyz"), Err("invalid number"));
    println!("test passed");
}
```

# Explanation
Implement `parse_and_reciprocal(s: &str) -> Result<f64, &'static str>` that parses `s` into `f64` (returning `Err("invalid number")` on error) and then returns `1.0 / val` (returning `Err("zero division")` if `val == 0.0`). Review the test cases to verify all assertions.
