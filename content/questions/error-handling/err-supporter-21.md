---
id: err-supporter-21
categorySlug: error-handling
title: "Result::is_ok_and Condition"
difficulty: 2
tags: [error-handling, is_ok_and, result]
---

# Prompt
What does `res.is_ok_and(f)` return?

# Code
```rust
fn main() {
    let r: Result<i32, &str> = Ok(10);
    assert!(r.is_ok_and(|x| x > 5));
}
```

# Options
- [ ] A) A new Result containing the boolean predicate output in runtime memory
- [x] B) `true` if the result is `Ok` and the predicate returns `true`
- [ ] C) `true` if the result is `Err` matching the predicate in runtime memory
- [ ] D) Panics if the predicate evaluates to false during runtime execution

# Hint
is_ok_and checks that the Result is Ok AND satisfies the provided predicate.

# Explanation
`Result::is_ok_and(f)` returns `true` if the result is `Ok(v)` and `f(v)` returns `true`; otherwise it returns `false`.
