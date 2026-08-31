---
id: iter-supporter-20
categorySlug: iterators-closures
title: "Iterator::chain Sequence Concatenation"
difficulty: 1
tags: [iterators-closures, chain, adapters]
---

# Prompt
What does `iter_a.chain(iter_b)` do?

# Code
```rust
fn main() {
    let a = vec![1, 2];
    let b = vec![3, 4];
    let chained: Vec<_> = a.into_iter().chain(b).collect();
    assert_eq!(chained, vec![1, 2, 3, 4]);
}
```

# Options
- [ ] A) Pairs corresponding elements into tuples like `zip` under current compiler safety rules
- [ ] B) Executes both iterators in parallel threads concurrently within local thread memory
- [x] C) Yields all elements from `iter_a`, and then yields all elements from `iter_b`
- [ ] D) Interleaves elements alternately one by one from each iterator in runtime memory

# Hint
chain concatenates two iterators sequentially.

# Explanation
`Iterator::chain` yields elements from `iter_a` until exhaustion, and then seamlessly proceeds to yield elements from `iter_b`.
