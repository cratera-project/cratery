---
id: iter-supporter-34
categorySlug: iterators-closures
title: "Iterator::count vs len Efficiency"
difficulty: 2
tags: [iterators-closures, count, complexity]
---

# Prompt
Why is `iter.count()` O(N) while `slice.len()` is O(1)?

# Code
```rust
fn main() {
    let count = (0..10).filter(|x| x % 2 == 0).count();
    assert_eq!(count, 5);
}
```

# Options
- [x] A) `count()` must consume and advance the entire iterator stream to count items
- [ ] B) `count()` performs memory allocation checks on every element within local thread memory
- [ ] C) `slice.len()` executes a hardware assembly trap on each read within local thread memory
- [ ] D) `count()` runs in a separate thread requiring sync barriers within local thread memory

# Hint
count() consumes the iterator element by element unless specialized.

# Explanation
`Iterator::count()` iterates through every element by repeatedly calling `next()` until exhaustion. `slice.len()` is an O(1) field read from the slice's fat pointer metadata.
