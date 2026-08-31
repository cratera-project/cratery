---
id: iter-supporter-28
categorySlug: iterators-closures
title: "Extend Trait on Collections"
difficulty: 2
tags: [iterators-closures, extend, collections]
---

# Prompt
What does the `Extend` trait do when implemented on collections?

# Code
```rust
fn main() {
    let mut v = vec![1, 2];
    v.extend([3, 4]);
    assert_eq!(v, vec![1, 2, 3, 4]);
}
```

# Options
- [ ] A) Reallocates the collection in thread-local storage within local thread memory
- [ ] B) Extends the lifetime of references stored in the collection in runtime memory
- [x] C) Appends all elements from an `IntoIterator` into the existing collection
- [ ] D) Merges two collections by sorting their combined elements in runtime memory

# Hint
Extend::extend consumes an iterator and inserts its elements into self.

# Explanation
`std::iter::Extend` defines `fn extend<T: IntoIterator>(&mut self, iter: T)`. It extends an existing collection by iterating through `iter` and appending each element.
