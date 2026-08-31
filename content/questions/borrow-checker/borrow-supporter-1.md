---
id: borrow-supporter-1
categorySlug: borrow-checker
title: "Two-Phase Borrows in Method Calls"
difficulty: 3
tags: [borrow-checker, two-phase-borrows, nll]
---

# Prompt
Why does `vec.push(vec.len())` compile successfully under modern NLL?

# Code
```rust
fn main() {
    let mut vec = vec![1, 2, 3];
    vec.push(vec.len());
    assert_eq!(vec, vec![1, 2, 3, 3]);
}
```

# Options
- [ ] A) Two-phase reservation delays the active mutable borrow of `vec` until argument evaluation completes
- [ ] B) The compiler executes `vec.len()` asynchronously on a background worker thread before push execution
- [x] C) The compiler automatically duplicates the vector into temporary heap storage memory buffers
- [ ] D) `push` is a macro that expands argument evaluations ahead of time during compile analysis

# Hint
Two-phase borrows allow shared reading of the receiver while evaluating arguments.

# Explanation
Under Two-Phase Borrows, calling `vec.push(vec.len())` initially takes a "reserved" mutable borrow of `vec` that permits shared reads (like `vec.len()`) during argument evaluation, activating as exclusive only when `push` is called.
