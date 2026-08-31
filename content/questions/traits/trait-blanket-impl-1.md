---
id: trait-blanket-impl-1
categorySlug: traits
title: "Blanket Implementations"
difficulty: 3
tags: [traits, blanket-impl]
---

# Prompt
What does this style of `impl` represent?

# Code
```rust
impl<T: Display> ToString for T {
    // ...
}
```

# Options
- [ ] A) An impl that applies only to the `String` type
- [x] B) A blanket impl: any `T: Display` gets `ToString`
- [ ] C) An impl that disables all other `ToString` impls
- [ ] D) An impl that forces heap allocation for every `T`

# Hint
The impl is parameterized over all types meeting a bound.

# Explanation
A blanket implementation applies to every type that satisfies the bound. The standard library uses this so any `Display` type automatically gets `to_string()`.
