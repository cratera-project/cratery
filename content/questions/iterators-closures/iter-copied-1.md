---
id: iter-copied-1
categorySlug: iterators-closures
title: "copied vs cloned"
difficulty: 2
tags: [iterators, copied]
---

# Prompt
What does `.copied()` require and do?

# Code
```rust
fn main() {
    let v = [1, 2, 3];
    let s: Vec<i32> = v.iter().copied().collect();
    assert_eq!(s, vec![1, 2, 3]);
}
```

# Options
- [x] A) `T: Copy`; it copies `&T` items into owned `T`
- [ ] B) `T: Clone`; it always heap-allocates each item
- [ ] C) No bounds; it converts the iterator into a `Vec`
- [ ] D) `T: Copy`; it moves elements out of the slice

# Hint
`iter()` yields `&T`; `copied` turns that into `T`.

# Explanation
`.copied()` is for iterators of `&T` where `T: Copy`: it bitwise-copies each item. `.cloned()` needs `T: Clone` and calls `clone()` (which may allocate). Neither consumes the slice; `v.iter()` still only borrows. `collect` is a separate adapter.
