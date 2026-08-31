---
id: trait-object-vtable-1
categorySlug: traits
title: "Pointers to Trait Objects"
difficulty: 3
tags: [traits, dyn, dispatch]
---

# Prompt
What does a pointer to a trait object (`Box<dyn Draw>`) carry?

# Code
```rust
let x: Box<dyn Draw> = /* ... */;
```

# Options
- [ ] A) Only method pointers, with no concrete data
- [ ] B) Only the concrete value, with no method table
- [ ] C) A copy of every `impl` for every type in the crate
- [x] D) A data pointer plus a vtable for trait methods

# Hint
Fat pointers pair data with how to call the trait.

# Explanation
Per the Reference, `dyn Draw` is the trait object (an unsized opaque value). Pointers to it (`&dyn Draw`, `Box<dyn Draw>`) are fat: a pointer to the concrete value plus a vtable for dynamic dispatch.
