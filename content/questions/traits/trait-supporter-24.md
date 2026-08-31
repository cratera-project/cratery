---
id: trait-supporter-24
categorySlug: traits
title: "impl Trait in Return Position"
difficulty: 2
tags: [traits, impl-trait, performance]
---

# Prompt
What is the primary benefit of `-> impl Trait` over `-> Box<dyn Trait>`?

# Code
```rust
fn make_iter() -> impl Iterator<Item = i32> {
    (0..10).filter(|x| x % 2 == 0)
}
```

# Options
- [ ] A) Ability to return multiple distinct concrete types conditionally
- [x] B) Static dispatch with zero heap allocation overhead
- [ ] C) Automatic serialization across network socket boundaries
- [ ] D) Dynamic runtime replacement of the returned closure

# Hint
impl Trait uses static monomorphization without allocating on the heap.

# Explanation
`impl Trait` in return position uses static dispatch: the compiler determines the concrete type at compile time, avoiding the heap allocation and vtable indirection of `Box<dyn Trait>`.
