---
id: trait-where-clause-1
categorySlug: traits
title: "`where` Clause"
difficulty: 2
tags: [traits, bounds, where]
---

# Prompt
What does a `where` clause change here?

# Code
```rust
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
    0
}
```

# Options
- [ ] A) It makes the generic function faster at runtime
- [ ] B) It switches every call site to dynamic dispatch
- [x] C) Nothing semantic, just clearer bound placement
- [ ] D) It forces both `T` and `U` to be the same type

# Hint
These bounds could also be written next to `T` and `U`.

# Explanation
Here `where` only relocates bounds that could also be written as `T: Display + Clone` and `U: Clone + Debug` after each type parameter. That inline form is a shorthand for simple parameter bounds. `where` is the general place for bounds and does not change dispatch, performance, or force `T` and `U` to match.
