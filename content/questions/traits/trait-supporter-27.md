---
id: trait-supporter-27
categorySlug: traits
title: "DispatchFromDyn for Custom Receivers"
difficulty: 3
tags: [traits, dispatch-from-dyn, receivers]
---

# Prompt
What trait enables custom smart pointers to be used as method receivers on `dyn Trait`?

# Code
```rust
// struct CustomPtr<T: ?Sized>(Box<T>);
```

# Options
- [x] A) Static dispatch via compiler monomorphization
- [ ] B) Dynamic dispatch via vtable fat pointers
- [ ] C) Asynchronous task scheduling via executors
- [ ] D) Thread-safe communication via channels

# Hint
DispatchFromDyn is the compiler trait allowing types to act as dyn method receivers.

# Explanation
`DispatchFromDyn` is the internal trait that allows a type to act as a method receiver for trait objects (like `self: CustomPtr<Self>`).
