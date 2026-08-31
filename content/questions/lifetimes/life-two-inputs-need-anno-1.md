---
id: life-two-inputs-need-anno-1
categorySlug: lifetimes
title: "Two Inputs, One Output"
difficulty: 3
tags: [lifetimes, functions]
---

# Prompt
Why does Rust require lifetime annotations here?

# Code
```rust
fn pick(x: &str, y: &str) -> &str {
    if !x.is_empty() { x } else { y }
}
```

# Options
- [ ] A) Free functions cannot return `&str` values at all
- [ ] B) The borrow checker cannot evaluate `if` arm results
- [x] C) Elision cannot pick which input the output borrows
- [ ] D) `is_empty` forces a temporary borrow of both inputs

# Hint
Two input refs do not get an automatic output lifetime.

# Explanation
With two input references, elision gives each its own lifetime and does not invent an output lifetime. Because the body may return `x` or `y`, you must state the contract, e.g. one shared lifetime, or an output tied to a specific input.
