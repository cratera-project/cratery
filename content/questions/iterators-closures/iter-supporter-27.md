---
id: iter-supporter-27
categorySlug: iterators-closures
title: "Iterator::rfold Reverse Accumulation"
difficulty: 2
tags: [iterators-closures, intersperse, adapters]
---

# Prompt
How does `iter.rfold(init, f)` process elements compared to `fold`?

# Code
```rust
fn main() {
    let numbers = vec![1, 2, 3];
    let res = numbers.into_iter().rfold(0, |acc, x| acc * 10 + x);
    assert_eq!(res, 321);
}
```

# Options
- [ ] A) Executes accumulation concurrently across worker threads in code
- [x] B) Processes elements from right to left starting from the end
- [ ] C) Reverses the internal heap allocation buffer in place in code
- [ ] D) Short-circuits immediately when a zero value is found in code

# Hint
intersperse places a separator clone between every pair of elements.

# Explanation
`Iterator::rfold` operates on `DoubleEndedIterator` by consuming elements in reverse order (from back to front).
