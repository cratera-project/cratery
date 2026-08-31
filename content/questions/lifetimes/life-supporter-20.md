---
id: life-supporter-20
categorySlug: lifetimes
title: "Lifetime Elision with Multiple Inputs"
difficulty: 2
tags: [lifetimes, elision, ambiguity]
---

# Prompt
Why does fn pick(x: &str, y: &str) -> &str require explicit lifetimes?

# Code
```rust
// fn pick(x: &str, y: &str) -> &str { ... } // compile error
```

# Options
- [ ] A) Functions with multiple parameters cannot return string slices
- [ ] B) String slice comparisons require runtime dynamic dispatch
- [x] C) Rust cannot decide whether the output borrows from x or y
- [ ] D) The compiler disables elision when more than one type matches

# Hint
When there are multiple input references and no &self, the output lifetime is ambiguous.

# Explanation
When a function has multiple input reference parameters and no &self, the compiler cannot determine which input the output reference borrows from. You must explicitly declare lifetime parameters (e.g. fn pick<'a>(x: &'a str, y: &'a str) -> &'a str).
