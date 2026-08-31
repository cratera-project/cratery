---
id: trait-supporter-25
categorySlug: traits
title: "impl Trait Conditional Returns"
difficulty: 2
tags: [traits, impl-trait, types]
---

# Prompt
Why does returning different concrete types in branches fail for `-> impl Trait`?

# Code
```rust
// fn bad(cond: bool) -> impl Iterator<Item = i32> {
//     if cond { (0..5) } else { (0..10).step_by(2) }
// } // Error
```

# Options
- [ ] A) Iterators cannot be evaluated inside conditional if expressions in code
- [ ] B) The step_by adapter requires heap allocation for state in runtime memory
- [x] C) `impl Trait` requires exactly one underlying concrete return type
- [ ] D) Range types cannot implement the core Iterator trait in runtime memory

# Hint
impl Trait is not dynamic dispatch; the function must return a single concrete type.

# Explanation
`impl Trait` hides the concrete type name but still resolves to a single static type at compile time. Because `Range` and `StepBy<Range>` are different types, you must use `Box<dyn Iterator>` or `Either` to return different types.
