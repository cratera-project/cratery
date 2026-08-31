---
id: err-supporter-20
categorySlug: error-handling
title: "Option::inspect Inspection"
difficulty: 2
tags: [error-handling, inspect, option]
---

# Prompt
What does `opt.inspect(f)` do?

# Code
```rust
fn main() {
    let opt = Some(42);
    let res = opt.inspect(|x| println!("value is {x}"));
    assert_eq!(res, Some(42));
}
```

# Options
- [x] A) Executes `f(&v)` for side-effects if `Some(v)` and returns the original option
- [ ] B) Transforms the inner value into a string for logging under current compiler safety rules
- [ ] C) Converts `Option<T>` into a Result with debug information within local thread memory
- [ ] D) Checks if the inner value is uninitialized memory during runtime execution in code

# Hint
inspect calls a closure on &v if Some without consuming or changing the Option.

# Explanation
`Option::inspect` (and `Result::inspect`) calls a closure with a shared reference to the contained value for side-effects (like logging or debugging) and passes the original `Option` through unchanged.
