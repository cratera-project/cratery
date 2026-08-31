---
id: borrow-two-phase-reservation-1
categorySlug: borrow-checker
title: "Two-Phase Borrows"
difficulty: 3
tags: [borrow-checker, two-phase, nll]
---

# Prompt
Why does `list.push(list.len())` compile without borrow errors?

# Code
```rust
fn main() {
    let mut list = vec![10, 20, 30];
    list.push(list.len());
    println!("{:?}", list);
}
```

# Options
- [ ] A) list.len() is evaluated at compile-time as a constant
- [ ] B) Vec::push automatically creates a cloned copy of list
- [ ] C) The compiler executes list.len() after push finishes
- [x] D) Two-phase borrows defer exclusive borrow activation

# Hint
How does NLL handle method calls whose arguments borrow the receiver?

# Explanation
Rust's non-lexical lifetimes (NLL) support two-phase borrows for method calls. In `list.push(list.len())`, the mutable borrow of `list` for `.push(...)` starts in a 'reserved' state, permitting shared borrows like `list.len()` during argument evaluation. The exclusive borrow only activates once argument evaluation completes and the method is invoked.
