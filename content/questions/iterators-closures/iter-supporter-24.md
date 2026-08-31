---
id: iter-supporter-24
categorySlug: iterators-closures
title: "Iterator::rposition in DoubleEndedIterator"
difficulty: 2
tags: [iterators-closures, rposition, search]
---

# Prompt
What does `iter.rposition(predicate)` do on an `ExactSizeIterator + DoubleEndedIterator`?

# Code
```rust
fn main() {
    let nums = vec![1, 2, 3, 2, 1];
    let pos = nums.into_iter().rposition(|x| x == 2);
    assert_eq!(pos, Some(3));
}
```

# Options
- [ ] A) Returns the index counted backwards starting with 0 at the end in runtime memory
- [ ] B) Reverses the vector and returns the first matching element value in runtime memory
- [x] C) Searches from right to left and returns the 0-based index from the start
- [ ] D) Panics if multiple matching elements exist in the collection in runtime memory

# Hint
rposition searches from right to left, returning the 0-based index from the left.

# Explanation
`Iterator::rposition` searches from right to left, returning `Some(index)` (`usize`) representing the index from the front of the collection.
