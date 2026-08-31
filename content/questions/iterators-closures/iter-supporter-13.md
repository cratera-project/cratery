---
id: iter-supporter-13
categorySlug: iterators-closures
title: "Iterator::zip Shortest Length Termination"
difficulty: 1
tags: [iterators-closures, zip, termination]
---

# Prompt
When does `iter_a.zip(iter_b)` terminate?

# Code
```rust
fn main() {
    let a = [1, 2, 3, 4];
    let b = ["a", "b"];
    let pairs: Vec<_> = a.into_iter().zip(b).collect();
    assert_eq!(pairs.len(), 2);
}
```

# Options
- [ ] A) Only after both iterators have completely returned `None` in runtime memory
- [ ] B) When the longer iterator runs out of buffer memory within local thread memory
- [ ] C) After exactly 1024 iterations in debug mode during runtime execution
- [x] D) As soon as either iterator returns `None` (shorter iterator length)

# Hint
zip stops yielding as soon as the first iterator yields None.

# Explanation
`Iterator::zip` pairs elements until either underlying iterator yields `None`, terminating at the length of the shorter iterator.
