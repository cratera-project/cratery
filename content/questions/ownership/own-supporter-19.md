---
id: own-supporter-19
categorySlug: ownership
title: "Cell Get and Set Semantics"
difficulty: 2
tags: [ownership, cell, copy]
---

# Prompt
Why does `Cell<T>` require `T: Copy` for `cell.get()`?

# Code
```rust
use std::cell::Cell;
fn main() {
    let c = Cell::new(42);
    let val = c.get();
    println!("{val}");
}
```

# Options
- [ ] A) Cell wraps all contents in immutable shared atomic counters
- [ ] B) Primitive types are the only types supported by standard Cell
- [x] C) Cell cannot return references and must copy the inner data
- [ ] D) Cell synchronizes memory access across multiple OS threads

# Hint
Cell provides interior mutability without giving out references to its interior.

# Explanation
`Cell<T>` never hands out references to its interior to avoid aliasing bugs. Therefore, `get()` must return an owned duplicate of `T`, requiring `T: Copy`. For non-`Copy` types, use `take()` or `replace()`.
