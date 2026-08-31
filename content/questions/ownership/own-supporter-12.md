---
id: own-supporter-12
categorySlug: ownership
title: "mem::replace Return Semantics"
difficulty: 2
tags: [ownership, mem, replace]
---

# Prompt
What value is stored in `prev` after `mem::replace(&mut count, 10)`?

# Code
```rust
use std::mem;
fn main() {
    let mut count = 5;
    let prev = mem::replace(&mut count, 10);
    println!("prev: {prev}, count: {count}");
}
```

# Options
- [ ] A) `prev` is 10 and `count` is 5 (values are cloned) in code
- [ ] B) `prev` is 10 and `count` is 10 (both are updated) in code
- [ ] C) `prev` is 5 and `count` is 5 (assignment is deferred)
- [x] D) `prev` is 5 and `count` is 10 (old value returned)

# Hint
mem::replace moves the new value in and returns the old value.

# Explanation
`mem::replace(&mut dest, src)` writes `src` into `dest` and returns the previous value that was in `dest`. Here, `prev` receives 5 and `count` becomes 10.
