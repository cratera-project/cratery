---
id: iter-supporter-3
categorySlug: iterators-closures
title: "DoubleEndedIterator::next_back"
difficulty: 2
tags: [iterators-closures, double-ended, rev]
---

# Prompt
What does `iter.next_back()` do on a `DoubleEndedIterator`?

# Code
```rust
fn main() {
    let mut iter = [10, 20, 30].into_iter();
    assert_eq!(iter.next_back(), Some(30));
    assert_eq!(iter.next(), Some(10));
    assert_eq!(iter.next_back(), Some(20));
    assert_eq!(iter.next(), None);
}
```

# Options
- [ ] A) Reverses the internal array order in memory before returning in runtime memory
- [x] B) Yields the next element from the end of the collection towards the front
- [ ] C) Returns the last element without advancing the iterator cursor in runtime memory
- [ ] D) Panics if called after `next()` has already been called within local thread memory

# Hint
DoubleEndedIterator can produce elements from either end until meeting in the middle.

# Explanation
`DoubleEndedIterator::next_back()` removes and returns an element from the rear of the iterator. Elements can be drawn from either end until the iteration converges and yields `None`.
