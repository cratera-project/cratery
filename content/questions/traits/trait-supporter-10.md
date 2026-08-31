---
id: trait-supporter-10
categorySlug: traits
title: "Trait Object Dispatch Mechanism"
difficulty: 2
tags: [traits, dyn, vtable]
---

# Prompt
What two pointers comprise a trait object `&dyn Trait` in memory (fat pointer)?

# Code
```rust
trait Greeter { fn greet(&self); }
fn call(g: &dyn Greeter) {
    g.greet();
}
```

# Options
- [ ] A) A stack pointer and a heap allocator memory pointer during execution
- [ ] B) A function pointer and an atomic reference count pointer
- [ ] C) Two identical data pointers for CPU redundancy verification
- [x] D) A data pointer to the instance and a vtable pointer

# Hint
Fat pointers contain a pointer to data and a pointer to the vtable.

# Explanation
A trait object reference `&dyn Trait` is a 16-byte fat pointer containing: 1) a pointer to the concrete data, and 2) a pointer to the virtual method table (vtable) containing function pointers and drop glue.
