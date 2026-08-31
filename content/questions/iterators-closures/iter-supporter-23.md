---
id: iter-supporter-23
categorySlug: iterators-closures
title: "Iterator::position vs find"
difficulty: 2
tags: [iterators-closures, position, searching]
---

# Prompt
What does `iter.position(predicate)` return?

# Code
```rust
fn main() {
    let nums = vec![10, 20, 30, 40];
    let pos = nums.into_iter().position(|x| x == 30);
    assert_eq!(pos, Some(2));
}
```

# Options
- [ ] A) `Option<T>` containing a reference to the matched element within local thread memory
- [x] B) `Option<usize>` containing the 0-based index of the first matching element
- [ ] C) `bool` indicating whether the element was found during runtime execution in code
- [ ] D) A raw memory pointer to the element in the heap during runtime execution in code

# Hint
position returns Some(index) of the first element satisfying the predicate.

# Explanation
`Iterator::position` searches from left to right and returns `Some(index)` (`Option<usize>`) for the first element where `predicate` returns `true`, or `None` if not found.
