---
id: err-supporter-22
categorySlug: error-handling
title: "Option::xor Exclusive Or"
difficulty: 2
tags: [error-handling, xor, option]
---

# Prompt
What does `opt_a.xor(opt_b)` return if both options are `Some`?

# Code
```rust
fn main() {
    let a = Some(1);
    let b = Some(2);
    assert_eq!(a.xor(b), None);
}
```

# Options
- [ ] A) `Some(3)` combining both input elements
- [ ] B) `Some(1)` taking the first operand only
- [x] C) `None` because both options are `Some`
- [ ] D) `Some(2)` taking second operand value

# Hint
xor returns Some if exactly one option is Some, and None if both are Some or both None.

# Explanation
`Option::xor` computes logical XOR: if exactly one of `a` or `b` is `Some`, it returns that `Some`; if both are `Some` or both are `None`, it returns `None`.
