---
id: trait-supporter-33
categorySlug: traits
title: "Trait Associated Type vs Generic Parameter"
difficulty: 3
tags: [traits, associated-types, design]
---

# Prompt
When should a trait use an associated type instead of a generic parameter?

# Code
```rust
// trait Iterator { type Item; ... } vs trait Iterator<Item> { ... }
```

# Options
- [ ] A) When a type needs multiple implementations for different types in code
- [ ] B) When the trait must be implemented exclusively for references in code
- [x] C) When there is only one logical implementation per concrete type
- [ ] D) When all trait methods are marked with the const qualifier in code

# Hint
Associated types model a 1-to-1 relationship; generics model a 1-to-many relationship.

# Explanation
Use an associated type when there should only be one implementation of the trait per type (e.g. a `Vec<i32>` iterator only yields `i32`). Use a generic parameter when multiple implementations are desired (e.g. `From<T>` for multiple `T`).
