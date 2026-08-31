---
id: trait-object-safety-1
categorySlug: traits
title: "Dyn Compatibility"
difficulty: 3
tags: [traits, dyn, dyn-compatibility]
---

# Prompt
Why can’t this trait be a trait object?

# Code
```rust
trait Bad {
    fn clone_me(&self) -> Self;
}

// let x: Box<dyn Bad> = ...;  // error
```

# Options
- [x] A) Returning `Self` by value isn’t dyn-compatible
- [ ] B) Traits with methods can never become `dyn`
- [ ] C) `Box` cannot hold unsized trait objects at all
- [ ] D) Dyn compatibility requires every method to be `async`

# Hint
The compiler must know the returned size for `dyn Trait`.

# Explanation
A trait must be dyn-compatible (formerly called object-safe) to be used as `dyn Trait`. Methods that return `Self` by value are not dyn-compatible, because the concrete size isn’t known for `dyn Bad`. Methods taking `Self` by value are similarly problematic. Use generics, or redesign the API (e.g. return `Box<dyn Bad>`).
