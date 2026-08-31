---
id: ptr-supporter-3
categorySlug: pointers
title: "Cow::to_mut Allocation Behavior"
difficulty: 2
tags: [pointers, cow, clone-on-write]
---

# Prompt
When does `Cow::to_mut` perform a heap allocation?

# Code
```rust
use std::borrow::Cow;

fn main() {
    let mut c: Cow<str> = Cow::Borrowed("hello");
    let s = c.to_mut();
    s.push_str(" world");
    println!("{c}");
}
```

# Options
- [ ] A) On every call to `to_mut`, creating fresh heap buffers each time in runtime memory
- [ ] B) Never; `Cow::to_mut` modifies borrowed slices directly in place in runtime memory
- [x] C) Only when `Cow` is currently holding a borrowed `Cow::Borrowed` variant
- [ ] D) Only when the length of the string exceeds 1024 bytes within local thread memory

# Hint
If already owned, to_mut returns a mutable reference directly without reallocating.

# Explanation
`Cow::to_mut` checks the variant: if `Borrowed`, it clones the data into `Owned` (allocating on the heap) and mutates in place; if already `Owned`, it returns `&mut Owned` with zero new allocations.
