---
id: iter-supporter-9
categorySlug: iterators-closures
title: "Iterator::scan Stateful Adapter"
difficulty: 2
tags: [iterators-closures, scan, stateful]
---

# Prompt
How does `Iterator::scan` maintain internal state across iteration steps?

# Code
```rust
fn main() {
    let nums = vec![1, 2, 3, 4];
    let cumulative: Vec<i32> = nums.into_iter()
        .scan(0, |state, x| {
            *state += x;
            Some(*state)
        })
        .collect();
    assert_eq!(cumulative, vec![1, 3, 6, 10]);
}
```

# Options
- [ ] A) Stores state inside an atomic thread-local variable within local thread memory
- [ ] B) Clones the state object for every element in the collection in runtime memory
- [ ] C) Delegates state persistence to the operating system memory in runtime memory
- [x] D) Passes a mutable reference `&mut State` to the closure on each step

# Hint
scan passes &mut State and returns Option<B>, stopping early if None is returned.

# Explanation
`Iterator::scan(initial_state, f)` holds a state value and passes `&mut state` to the closure `f` on each iteration. The closure returns `Option<B>`, allowing stateful transformations and early termination.
