---
id: iter-supporter-32
categorySlug: iterators-closures
title: "Iterator::flatten Flattening Semantics"
difficulty: 2
tags: [iterators-closures, flatten, into-iterator]
---

# Prompt
What requirement must elements of `I` meet to use `iter.flatten()`?

# Code
```rust
fn main() {
    let nested = vec![vec![1, 2], vec![3, 4]];
    let flat: Vec<i32> = nested.into_iter().flatten().collect();
    assert_eq!(flat, vec![1, 2, 3, 4]);
}
```

# Options
- [ ] A) All elements must implement the `Copy` marker trait in code
- [ ] B) The outer collection must have a fixed compile-time size
- [x] C) The element type `I::Item` must implement `IntoIterator`
- [ ] D) Elements must be stored contiguously in physical RAM in code

# Hint
flatten requires each element Item to implement IntoIterator (e.g. Vec, Option, array).

# Explanation
`Iterator::flatten` requires `I::Item: IntoIterator`. It flattens one level of nested structure (e.g. `Vec<Vec<T>>` or `Vec<Option<T>>`).
