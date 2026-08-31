---
id: life-supporter-13
categorySlug: lifetimes
title: "Lifetime Bounds on Generics (T: 'a)"
difficulty: 2
tags: [lifetimes, bounds, generics]
---

# Prompt
What does the bound T: 'a require of the generic type T?

# Code
```rust
struct RefHolder<'a, T: 'a> {
    item: &'a T,
}
```

# Options
- [ ] A) T must be a reference type with lifetime exactly equal to 'a
- [ ] B) T must be allocated on the heap for the duration of 'a in code
- [ ] C) T must implement the Drop trait before scope 'a completes
- [x] D) Any references contained in T must live for at least 'a

# Hint
Type outlives bound T: 'a ensures all internal references in T outlive 'a.

# Explanation
The bound T: 'a ('T outlives 'a') means that T is valid for at least 'a. If T contains any borrowed references, those references must live for at least 'a. Owned types with no references satisfy T: 'static and thus T: 'a for any 'a.
