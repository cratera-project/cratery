---
id: err-code-parse-sum
categorySlug: error-handling
title: "Parse String Sum with Question Mark"
difficulty: 1
tags: [error-handling, coding]
kind: coding
---

# Prompt
Implement `parse_and_sum(a: &str, b: &str) -> Result<i32, std::num::ParseIntError>` parsing both strings to `i32` and returning their sum using `?`.

# Code
```rust
pub fn parse_and_sum(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let n1: i32 = a.parse()?;
    let n2: i32 = b.parse()?;
    Ok(n1 + n2)
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(parse_and_sum("10", "20"), Ok(30));
    assert!(parse_and_sum("abc", "20").is_err());
    println!("test passed");
}
```

# Explanation
Implement `parse_and_sum(a: &str, b: &str) -> Result<i32, std::num::ParseIntError>` parsing both strings to `i32` and returning their sum using `?`. Review the test cases to verify all assertions.
