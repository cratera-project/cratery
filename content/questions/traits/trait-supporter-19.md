---
id: trait-supporter-19
categorySlug: traits
title: "Trait Specialization Status"
difficulty: 3
tags: [traits, specialization, soundness]
---

# Prompt
Why is full trait specialization currently unstable in Rust?

# Code
```rust
// default impl<T> MyTrait for T { ... }
```

# Options
- [x] A) Soundness interactions with lifetime variance and subtyping
- [ ] B) Inability of LLVM to compile multiple trait functions in code
- [ ] C) Lack of support for virtual function tables in binaries in code
- [ ] D) High memory overhead when generating debug symbols in runtime memory

# Hint
Specialization creates subtle soundness holes when lifetimes differ only at runtime.

# Explanation
Full trait specialization is unstable because lifetime information is erased at compile time. Specializing based on types can create soundness holes where lifetime subtyping interacts with specialized implementations.
