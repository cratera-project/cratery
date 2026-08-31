---
id: iter-supporter-1
categorySlug: iterators-closures
title: "Iterator::by_ref Adapter"
difficulty: 2
tags: [iterators-closures, by-ref, adapters]
---

# Prompt
How does `iter.by_ref()` allow partially consuming an iterator without losing ownership?

# Code
```rust
fn main() {
    let mut iter = 1..=10;
    let head: Vec<_> = iter.by_ref().take(3).collect();
    assert_eq!(head, vec![1, 2, 3]);
    assert_eq!(iter.next(), Some(4));
}
```

# Options
- [ ] A) It creates a mutable reference adapter `&mut I` that implements `Iterator`
- [ ] B) It duplicates the iterator state onto the thread-local stack memory buffer
- [ ] C) It converts the iterator into a clone-on-write Cow buffer during execution
- [x] D) It freezes the iterator until all borrowed elements are dropped in scope

# Hint
by_ref borrows the iterator mutably (&mut iter) so adapters like take() do not consume the iterator.

# Explanation
`Iterator::by_ref` borrows the iterator mutably as `&mut I` (which also implements `Iterator`). When consuming adapters like `.take(3)` drop, the underlying iterator `iter` remains valid and ready for further items.
