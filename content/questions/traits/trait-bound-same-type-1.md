---
id: trait-bound-same-type-1
categorySlug: traits
title: "One `T` Means One Type"
difficulty: 3
tags: [traits, bounds, generics]
---

# Prompt
What does this signature force about the two items?

# Code
```rust
pub fn notify<T: Summary>(item1: &T, item2: &T) {}
```

# Options
- [ ] A) Both must be stored as `Box<dyn Summary>`
- [ ] B) Both must share one lifetime, not one type
- [ ] C) Both must be owned values, never references
- [x] D) Both must be the same concrete type `T`

# Hint
A single type parameter is one type per call site.

# Explanation
One `T` means one concrete type for that call. Both parameters must therefore be the same type that implements `Summary`, unlike two separate `impl Summary` parameters.
