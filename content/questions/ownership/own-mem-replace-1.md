---
id: own-mem-replace-1
categorySlug: ownership
title: "mem::replace Pattern"
difficulty: 2
tags: [ownership, mem]
---

# Prompt
What does `mem::replace` help you do?

# Code
```rust
use std::mem;
let mut s = String::from("old");
let old = mem::replace(&mut s, String::from("new"));
```

# Options
- [x] A) Move the old value out and store a valid replacement
- [ ] B) Clone `s` twice so both names own identical buffers
- [ ] C) Swap `s` with an uninitialized hole without a new value
- [ ] D) Convert `&mut String` into an owned `String` by copy

# Hint
You cannot leave `&mut` pointing at moved-from junk.

# Explanation
`mem::replace` moves the current value out of a mutable place and writes a new owned value in. That keeps the place valid while you take ownership of the previous contents, which is common when a field must stay initialized.
