---
id: iter-supporter-18
categorySlug: iterators-closures
title: "Iterator::take_while vs filter"
difficulty: 2
tags: [iterators-closures, take-while, filter]
---

# Prompt
How does `take_while` differ from `filter`?

# Code
```rust
fn main() {
    let nums = vec![1, 2, 5, 2, 1];
    let taken: Vec<_> = nums.into_iter().take_while(|&x| x < 4).collect();
    assert_eq!(taken, vec![1, 2]);
}
```

# Options
- [x] A) `take_while` terminates the iterator completely at the first `false` item
- [ ] B) `take_while` evaluates the predicate across all items in parallel in runtime memory
- [ ] C) `filter` stops iteration immediately when `false` is encountered in runtime memory
- [ ] D) `take_while` collects items into an array of fixed capacity in runtime memory

# Hint
take_while stops at the first false; filter checks every item in the iterator.

# Explanation
`take_while` yields items only until the predicate returns `false` for the first time, at which point it terminates. `filter` tests every item in the iterator and keeps all matching ones.
