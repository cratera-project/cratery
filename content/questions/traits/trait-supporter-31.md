---
id: trait-supporter-31
categorySlug: traits
title: "Associated Type Equality Constraint"
difficulty: 2
tags: [traits, associated-types, constraints]
---

# Prompt
What does the bound `T: Iterator<Item = u32>` enforce?

# Code
```rust
fn sum_u32<I>(iter: I) -> u32
where
    I: Iterator<Item = u32>,
{
    iter.sum()
}
```

# Options
- [x] A) `I` must be an iterator whose associated `Item` type is exactly `u32`
- [ ] B) `I` must convert all yielded items to u32 at runtime within local thread memory
- [ ] C) `I` must yield a fixed size array of 32 elements during runtime execution
- [ ] D) `I` must be an asynchronous stream running on Rayon within local thread memory

# Hint
Item = u32 binds the associated type Item to a concrete type.

# Explanation
The associated type equality constraint `Item = u32` restricts generic type `I` to implementations of `Iterator` where the associated type `Item` matches `u32`.
