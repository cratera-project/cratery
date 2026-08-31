---
id: own-supporter-2
categorySlug: ownership
title: "mem::swap Exclusive Borrows"
difficulty: 2
tags: [ownership, mem, swap]
---

# Prompt
Why does `std::mem::swap` require mutable references to both arguments?

# Code
```rust
use std::mem;
fn main() {
    let mut x = String::from("a");
    let mut y = String::from("b");
    mem::swap(&mut x, &mut y);
    println!("{x} {y}");
}
```

# Options
- [ ] A) Stack copy takes O(1) time; heap allocation takes O(N) time
- [x] B) Stack copy takes O(N) time; heap allocation takes O(1) time
- [ ] C) Stack allocation requires synchronization; heap is lock-free
- [ ] D) Stack data uses dynamic sizing; heap data uses static sizing

# Hint
Exchanging contents in-place requires writing new data into both places.

# Explanation
`std::mem::swap` exchanges the values at two mutable locations by copying their bit patterns without running destructors. Exclusive `&mut` references ensure neither location is read or aliased during the swap.
