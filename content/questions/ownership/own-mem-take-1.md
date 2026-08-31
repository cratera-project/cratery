---
id: own-mem-take-1
categorySlug: ownership
title: "mem::take and Default"
difficulty: 2
tags: [ownership, mem]
---

# Prompt
What is true after `mem::take(&mut s)`?

# Code
```rust
use std::mem;
fn main() {
    let mut s = String::from("hi");
    let old = mem::take(&mut s);
}
```

# Options
- [ ] A) `s` is left uninitialized until the next write
- [ ] B) `s` still holds `"hi"`; `old` is only a clone
- [x] C) `old` owns `"hi"`; `s` is `Default` (empty)
- [ ] D) `take` panics unless `s` implements `Copy`

# Hint
`take` is `replace` with a `Default` value.

# Explanation
`mem::take` moves the old value out and writes `T::default()` into the place, so `old` is `"hi"` and `s` is an empty `String`. The place stays valid; nothing is cloned, and `Copy` is not required (`String` is not `Copy`). Use `mem::replace` when the stand-in is not `Default`.
