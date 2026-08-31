---
id: iter-supporter-29
categorySlug: iterators-closures
title: "Iterator::all vs Iterator::any Short-Circuiting"
difficulty: 1
tags: [iterators-closures, all, short-circuit]
---

# Prompt
When does `iter.all(predicate)` short-circuit?

# Code
```rust
fn main() {
    let nums = vec![2, 4, 5, 6];
    assert!(!nums.into_iter().all(|x| x % 2 == 0));
}
```

# Options
- [ ] A) Only after inspecting all elements in the entire collection
- [ ] B) As soon as the predicate returns `true` for any element in code
- [ ] C) When the iterator produces a `None` terminal value in code
- [x] D) As soon as the predicate returns `false` for any element

# Hint
all stops immediately as soon as a false is encountered, returning false.

# Explanation
`Iterator::all` short-circuits immediately upon the first element for which `predicate` returns `false`, returning `false` without inspecting the rest.
