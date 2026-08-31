---
id: iter-supporter-19
categorySlug: iterators-closures
title: "Iterator::cycle Infinite Iteration"
difficulty: 2
tags: [iterators-closures, cycle, infinite]
---

# Prompt
What happens when an iterator produced by `iter.cycle()` reaches the end?

# Code
```rust
fn main() {
    let mut cycle = vec![1, 2].into_iter().cycle();
    assert_eq!(cycle.next(), Some(1));
    assert_eq!(cycle.next(), Some(2));
    assert_eq!(cycle.next(), Some(1));
}
```

# Options
- [ ] A) Reverses the sequence direction and iterates backwards within local thread memory
- [x] B) Restarts iteration from the beginning repeatedly, iterating infinitely
- [ ] C) Returns `None` after exactly two full cycles during runtime execution in code
- [ ] D) Panics with a circular reference error on loop completion in runtime memory

# Hint
cycle repeats the iterator endlessly by cloning the initial iterator state (requires Clone).

# Explanation
`Iterator::cycle` repeats the elements endlessly: when the end is reached, it starts again from the beginning (requires `Self: Clone`).
