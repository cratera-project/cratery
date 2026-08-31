---
id: iter-supporter-4
categorySlug: iterators-closures
title: "ExactSizeIterator::len vs Iterator::size_hint"
difficulty: 2
tags: [iterators-closures, exact-size, size-hint]
---

# Prompt
What guarantee does `ExactSizeIterator` provide over `size_hint()`?

# Code
```rust
fn print_len<I: ExactSizeIterator>(iter: I) {
    println!("Exact remaining elements: {}", iter.len());
}

fn main() {
    let v = vec![1, 2, 3];
    print_len(v.into_iter());
}
```

# Options
- [ ] A) `len()` is evaluated at compile time as a constant expression in runtime memory
- [ ] B) The collection is guaranteed to fit within a single CPU cache line in code
- [x] C) `iter.len()` is guaranteed to be exact and equal to the remaining items
- [ ] D) Elements can be accessed by numerical index in O(1) time in runtime memory

# Hint
ExactSizeIterator guarantees that size_hint().0 == size_hint().1 and provides .len().

# Explanation
`ExactSizeIterator` guarantees that `iter.len()` accurately reports the exact number of elements remaining in the iteration (`(len, Some(len))`), allowing callers to preallocate exact capacity.
