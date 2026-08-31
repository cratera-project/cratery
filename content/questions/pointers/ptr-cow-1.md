---
id: ptr-cow-1
categorySlug: pointers
title: "Cow::to_mut"
difficulty: 2
tags: [pointers, cow, borrow]
---

# Prompt
What does `to_mut` do on a borrowed `Cow<str>`?

# Code
```rust
use std::borrow::Cow;
let mut c: Cow<str> = Cow::Borrowed("hi");
c.to_mut().push_str("!");
```

# Options
- [ ] A) Mutates the original `&str` in place without copying
- [ ] B) Panics because borrowed `Cow` values are immutable
- [x] C) Clones to owned storage, then yields `&mut String`
- [ ] D) Converts `c` into `Rc<str>` for shared mutation

# Hint
`Cow` means clone-on-write when mutation is needed.

# Explanation
If the `Cow` is `Borrowed`, `to_mut` clones the data into the `Owned` variant, then returns a mutable reference to that owned value. If it is already owned, no clone is needed. Borrowed `&str` data itself is never mutated in place.
