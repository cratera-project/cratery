---
id: err-code-custom-enum-error
categorySlug: error-handling
title: "Custom Error Enum"
difficulty: 2
tags: [error-handling, coding]
kind: coding
---

# Prompt
Define `#[derive(Debug, PartialEq)] pub enum MathError { DivisionByZero, NegativeSquareRoot }` and implement `safe_sqrt_div(val: f64, divisor: f64) -> Result<f64, MathError>`.

# Code
```rust
#[derive(Debug, PartialEq)]
pub enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
}

pub fn safe_sqrt_div(val: f64, divisor: f64) -> Result<f64, MathError> {
    if divisor == 0.0 {
        return Err(MathError::DivisionByZero);
    }
    if val < 0.0 {
        return Err(MathError::NegativeSquareRoot);
    }
    Ok(val.sqrt() / divisor)
}
```

# Solution
```rust
#[derive(Debug, PartialEq)]
pub enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
}

pub fn safe_sqrt_div(val: f64, divisor: f64) -> Result<f64, MathError> {
    if divisor == 0.0 {
        return Err(MathError::DivisionByZero);
    }
    if val < 0.0 {
        return Err(MathError::NegativeSquareRoot);
    }
    Ok(val.sqrt() / divisor)
}
```

# Test Harness
```rust
{{SOLUTION}}

fn main() {
    assert_eq!(safe_sqrt_div(16.0, 2.0), Ok(2.0));
    assert_eq!(safe_sqrt_div(16.0, 0.0), Err(MathError::DivisionByZero));
    assert_eq!(safe_sqrt_div(-4.0, 2.0), Err(MathError::NegativeSquareRoot));
    println!("test passed");
}
```

# Explanation
Define `#[derive(Debug, PartialEq)] pub enum MathError { DivisionByZero, NegativeSquareRoot }` and implement `safe_sqrt_div(val: f64, divisor: f64) -> Result<f64, MathError>`. Review the test cases to verify all assertions.
