---
id: trait-objects-vs-generics-1
categorySlug: traits
title: "Trait Objects vs Generics"
difficulty: 3
tags: [traits, dyn, generics]
---

# Prompt
What is the key difference between these designs?

# Code
```rust
struct ScreenA { components: Vec<Box<dyn Draw>> }
struct ScreenB<T: Draw> { components: Vec<T> }
```

# Options
- [ ] A) Only generics can call methods from `Draw`
- [x] B) Trait objects mix types; generics keep one `T`
- [ ] C) Trait objects avoid heap; generics require `Box`
- [ ] D) Generics always dispatch methods at runtime

# Hint
Homogeneous vs heterogeneous collections.

# Explanation
`ScreenB<T>` is homogeneous: one concrete `T` per instance. `ScreenA` can hold mixed `Draw` implementors via trait objects. Generics use static dispatch (monomorphization); trait objects use dynamic dispatch.
