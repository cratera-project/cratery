---
id: life-supporter-3
categorySlug: lifetimes
title: "Contravariance in Function Pointers"
difficulty: 3
tags: [lifetimes, variance, function-pointers]
---

# Prompt
Why is fn(T) contravariant with respect to its argument type T?

# Code
```rust
fn call_with_short<'a>(f: fn(&'a str), s: &'a str) {
    f(s);
}
```

# Options
- [ ] A) Function arguments are always cloned before execution begins during execution
- [x] B) Functions expecting broader types can handle narrower inputs
- [ ] C) All function pointers in Rust default to invariant semantics
- [ ] D) Function pointers must only accept static reference bounds in code

# Hint
A function that can accept any reference (e.g. short) can be passed where a function accepting static is needed.

# Explanation
Function pointers are contravariant over their argument types. A function that can accept any short-lived reference &'a str is capable of accepting a 'static reference, so fn(&'a str) is a subtype of fn(&'static str).
