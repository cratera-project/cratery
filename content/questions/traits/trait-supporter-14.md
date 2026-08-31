---
id: trait-supporter-14
categorySlug: traits
title: "TryFrom Error Associated Type"
difficulty: 2
tags: [traits, try-from, errors]
---

# Prompt
What associated type is required when implementing `TryFrom<T>`?

# Code
```rust
use std::convert::TryFrom;

struct PositiveI32(i32);

impl TryFrom<i32> for PositiveI32 {
    type Error = &'static str;
    fn try_from(value: i32) -> Result<Self, Self::Error> {
        if value > 0 { Ok(PositiveI32(value)) } else { Err("must be positive") }
    }
}
```

# Options
- [ ] A) `type Target` specifying the destination struct type during execution
- [ ] B) `type Item` defining the underlying payload type in code
- [ ] C) `type Output` specifying the Result wrapper type in code
- [x] D) `type Error` defining the failure type on conversion

# Hint
TryFrom requires type Error to represent conversion failures.

# Explanation
`TryFrom<T>` defines `type Error;` and returns `Result<Self, Self::Error>`, allowing the implementor to choose a custom error type for fallible conversions.
