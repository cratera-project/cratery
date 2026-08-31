---
id: own-supporter-31
categorySlug: ownership
title: "Rc Clone vs Value Clone"
difficulty: 2
tags: [ownership, rc, clone]
---

# Prompt
How does `rc.clone()` differ from `(*rc).clone()` for `Rc<Vec<u8>>`?

# Code
```rust
use std::rc::Rc;
fn main() {
    let data = Rc::new(vec![0u8; 10000]);
    let shared = data.clone();
    println!("{}", Rc::strong_count(&shared));
}
```

# Options
- [ ] A) `rc.clone()` duplicates the vector; `(*rc).clone()` increments count during execution
- [ ] B) Both expressions perform an identical deep copy of the buffer in runtime memory
- [x] C) `rc.clone()` increments ref count; `(*rc).clone()` duplicates vector
- [ ] D) Both expressions only increment the reference counter by one in runtime memory

# Hint
Calling clone directly on Rc copies the pointer and bumps the reference count.

# Explanation
`Rc::clone(&rc)` (or `rc.clone()`) is a cheap pointer copy that increments the strong reference count. Dereferencing `(*rc).clone()` invokes `Vec::clone`, duplicating all 10,000 bytes on the heap.
