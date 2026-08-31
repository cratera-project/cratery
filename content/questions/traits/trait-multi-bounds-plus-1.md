---
id: trait-multi-bounds-plus-1
categorySlug: traits
title: "Multiple Trait Bounds"
difficulty: 2
tags: [traits, bounds]
---

# Prompt
What does `T: Summary + Display` require?

# Code
```rust
fn f<T: Summary + Display>(t: &T) { /* ... */ }
```

# Options
- [ ] A) `T` implements `Summary` or else `Display`
- [ ] B) `T` is a subtype of both trait objects
- [ ] C) `T` returns values of both trait types
- [x] D) `T` implements `Summary` and `Display`

# Hint
`+` stacks requirements that all must hold.

# Explanation
The `+` syntax combines bounds. The caller must provide a type that implements both `Summary` and `Display`. Rust has no trait subtyping hierarchy like classical OOP.
