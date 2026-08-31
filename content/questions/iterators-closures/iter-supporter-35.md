---
id: iter-supporter-35
categorySlug: iterators-closures
title: "Iterator::collect Type Inference with Turbofish"
difficulty: 1
tags: [iterators-closures, turbofish, type-inference]
---

# Prompt
Why is the turbofish `collect::<Vec<_>>()` often needed when collecting iterators?

# Code
```rust
fn main() {
    let items = (0..5).collect::<Vec<_>>();
    assert_eq!(items.len(), 5);
}
```

# Options
- [ ] A) The compiler cannot deduce the size of primitive integer types in runtime memory
- [x] B) `collect()` can construct many different collection types via `FromIterator`
- [ ] C) Vector collections require explicit heap allocation permits within local thread memory
- [ ] D) Turbofish syntax disables runtime bounds checking on arrays within local thread memory

# Hint
FromIterator is implemented for Vec, HashSet, BTreeSet, LinkedList, Result, etc.

# Explanation
Because `collect()` can produce any type implementing `FromIterator` (such as `Vec`, `HashSet`, `BTreeSet`, `String`, `Result`), type inference cannot guess the target container without annotations or turbofish syntax `::<Vec<_>>()`.
