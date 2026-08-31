---
id: iter-supporter-6
categorySlug: iterators-closures
title: "Iterator::fold vs Iterator::reduce"
difficulty: 2
tags: [iterators-closures, fold, reduce]
---

# Prompt
How does `reduce(f)` differ from `fold(init, f)`?

# Code
```rust
fn main() {
    let empty: Vec<i32> = vec![];
    let res = empty.into_iter().reduce(|a, b| a + b);
    assert_eq!(res, None);
}
```

# Options
- [x] A) `reduce` uses the first element as initial accumulator and returns `Option<T>`
- [ ] B) `reduce` executes across multiple background worker threads concurrently in code
- [ ] C) `fold` requires all elements to implement the `Copy` marker trait in runtime memory
- [ ] D) `reduce` only works on non-negative integer primitives within local thread memory

# Hint
reduce uses the first element as accumulator and returns None on empty iterators.

# Explanation
`Iterator::reduce` uses the first element of the iterator as the initial accumulator value and returns `Option<T>` (yielding `None` if the iterator is empty), whereas `fold` takes an explicit initial value.
