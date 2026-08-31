---
id: trait-supporter-22
categorySlug: traits
title: "Negative Trait Bounds"
difficulty: 3
tags: [traits, negative-impl, send]
---

# Prompt
How does a type explicitly opt out of an auto trait like `Send`?

# Code
```rust
struct ThreadBound {
    _marker: std::marker::PhantomData<*const ()>,
}
```

# Options
- [ ] A) By adding the `#[no_send]` compiler attribute on the struct within local thread memory
- [ ] B) By implementing the `std::ops::Not` trait for the type within local thread memory
- [ ] C) By marking the struct declaration with the private keyword within local thread memory
- [x] D) By containing a non-Send field like raw pointers or `PhantomData<*const ()>`

# Hint
Containing a raw pointer (*const T or *mut T) prevents auto-derivation of Send/Sync.

# Explanation
Raw pointers (`*const T`, `*mut T`) do not implement `Send` or `Sync`. Including `PhantomData<*const ()>` in a struct automatically opts the struct out of `Send` and `Sync`.
