---
id: trait-supporter-17
categorySlug: traits
title: "DerefMut Requires Deref"
difficulty: 2
tags: [traits, deref, derefmut]
---

# Prompt
Why is `Deref` a supertrait of `DerefMut` (`pub trait DerefMut: Deref`)?

# Code
```rust
use std::ops::{Deref, DerefMut};

struct SmartPtr<T>(T);

impl<T> Deref for SmartPtr<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target { &self.0 }
}

impl<T> DerefMut for SmartPtr<T> {
    fn deref_mut(&mut self) -> &mut Self::Target { &mut self.0 }
}
```

# Options
- [ ] A) Immutable dereferencing is compiled as an atomic sub-operation
- [ ] B) All mutable operations in Rust must return Result wrappers in code
- [x] C) Mutable dereferencing requires sharing the same `Target` type
- [ ] D) DerefMut delegates method execution to background threads in code

# Hint
DerefMut reuses the type Target defined by Deref.

# Explanation
`DerefMut` relies on the `type Target` associated type declared in `Deref`. Therefore, any type implementing `DerefMut` must implement `Deref` with a matching target.
