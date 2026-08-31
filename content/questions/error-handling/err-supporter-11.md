---
id: err-supporter-11
categorySlug: error-handling
title: "Infallible Void Error Type"
difficulty: 2
tags: [error-handling, infallible, never-type]
---

# Prompt
What is `std::convert::Infallible` used for?

# Code
```rust
use std::convert::Infallible;
use std::str::FromStr;

struct AlwaysOk(String);

impl FromStr for AlwaysOk {
    type Err = Infallible;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(AlwaysOk(s.to_string()))
    }
}
```

# Options
- [ ] A) To represent errors that must trigger an immediate process abort in runtime memory
- [ ] B) As a placeholder for unhandled panic unwinding exceptions within local thread memory
- [ ] C) To disable compiler error checking on unsafe functions within local thread memory
- [x] D) As an error type for operations that can never fail (an uninstantiable enum)

# Hint
Infallible is an uninhabited type representing operations that never return an Err.

# Explanation
`std::convert::Infallible` is an empty enum (`enum Infallible {}`) with no variants. When used as `Result<T, Infallible>`, it statically proves to the compiler and caller that the operation never produces an error.
