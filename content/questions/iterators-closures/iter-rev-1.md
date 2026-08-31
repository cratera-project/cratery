---
id: iter-rev-1
categorySlug: iterators-closures
title: "Double-Ended rev"
difficulty: 2
tags: [iterators, rev]
---

# Prompt
Why does `(1..=3).rev()` produce `[3, 2, 1]`?

# Code
```rust
fn main() {
    let v: Vec<_> = (1..=3).rev().collect();
    assert_eq!(v, vec![3, 2, 1]);
}
```

# Options
- [ ] A) Every iterator can reverse by buffering in a `Vec`
- [x] B) `RangeInclusive` implements `DoubleEndedIterator`
- [ ] C) `rev` always walks the range twice to count first
- [ ] D) Inclusive ranges are stored backwards by rustc

# Hint
`rev` needs a back as well as a front.

# Explanation
`Iterator::rev` requires `DoubleEndedIterator` so it can pull from the back. `RangeInclusive<i32>` implements that, yielding 3, then 2, then 1, without collecting first. Many iterators (e.g. most `Map` over a one-way source) are not double-ended and cannot `.rev()`.
