---
id: trait-supporter-26
categorySlug: traits
title: "CoerceUnsized and Smart Pointers"
difficulty: 3
tags: [traits, coerce-unsized, compiler-magic]
---

# Prompt
What compiler trait enables `MyBox<T>` to coerce into `MyBox<dyn Trait>`?

# Code
```rust
// impl<T: ?Sized + Unsize<U>, U: ?Sized> CoerceUnsized<MyBox<U>> for MyBox<T> {}
```

# Options
- [ ] A) Dynamic dispatch via vtable fat pointers
- [ ] B) Static dispatch via compiler monomorphization
- [ ] C) Asynchronous task scheduling via executors
- [x] D) Thread-safe communication via channels

# Hint
CoerceUnsized is the built-in trait for unsizing coercions on custom pointer types.

# Explanation
`CoerceUnsized` is the compiler-supported trait that allows pointer-like structs (such as `Box`, `Rc`, `Arc`) to participate in unsizing coercions (e.g. `Box<T>` to `Box<dyn Trait>` or `Box<[T]>`).
