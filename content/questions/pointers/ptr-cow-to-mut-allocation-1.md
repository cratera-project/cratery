---
id: ptr-cow-to-mut-allocation-1
categorySlug: pointers
title: "Cow::to_mut Allocation"
difficulty: 2
tags: [pointers, cow, clone-on-write]
---

# Prompt
What is printed by this program?

# Code
```rust
use std::borrow::Cow;

fn main() {
    let mut item: Cow<str> = Cow::Borrowed("apple");
    item.to_mut().push_str(" pie");
    println!("owned: {}, val: {}", matches!(item, Cow::Owned(_)), item);
}
```

# Options
- [ ] A) owned: false, val: apple because Cow is always immutable
- [ ] B) owned: false, val: apple pie via in-place slice mutation
- [x] C) owned: true, val: apple pie because to_mut clones data
- [ ] D) Fails to compile because Cow::Borrowed has no to_mut()

# Hint
What does Cow do when you request mutable access to borrowed data?

# Explanation
`Cow::to_mut` returns a mutable reference to the owned value. If the `Cow` is currently `Cow::Borrowed`, `to_mut()` invokes `clone()` on the borrowed data, mutates the `Cow` in-place to `Cow::Owned`, and returns a mutable reference to the newly created owned buffer (here, a `String`). Subsequent mutations modify this owned buffer.
