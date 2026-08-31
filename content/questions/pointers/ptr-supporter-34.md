---
id: ptr-supporter-34
categorySlug: pointers
title: "Pin Set Method in Option Pinning"
difficulty: 3
tags: [pointers, pin, set]
---

# Prompt
How does `Pin::set(&mut pin, value)` work when `T: !Unpin`?

# Code
```rust
use std::pin::Pin;

fn main() {
    let mut val = 10;
    let mut p = Pin::new(&mut val);
    p.set(20);
    assert_eq!(*p, 20);
}
```

# Options
- [ ] A) It allocates a new heap block and updates the pointer address within local thread memory
- [x] B) It drops the old value in-place and writes the new value into the pinned location
- [ ] C) It panics if the inner type does not implement the Copy trait within local thread memory
- [ ] D) It suspends the active thread until all borrowers release memory within local thread memory

# Hint
p.set(val) drops old in-place and writes new without moving the memory location.

# Explanation
`Pin::set(&mut self, value)` safely overwrites the pinned location: it drops the existing value in place (`drop_in_place`) and writes `value` into the exact same memory address, upholding the pin contract.
