---
id: trait-supporter-16
categorySlug: traits
title: "Marker Traits in Rust"
difficulty: 2
tags: [traits, marker-traits, types]
---

# Prompt
What distinguishes a marker trait (such as `Send` or `Sync`) from standard traits?

# Code
```rust
trait MarkerTrait {}
struct Token;
impl MarkerTrait for Token {}
```

# Options
- [ ] A) Marker traits can only be implemented in unsafe blocks
- [x] B) Marker traits have no methods or associated items
- [ ] C) Marker traits are executed at runtime during initialization
- [ ] D) Marker traits are stripped from the binary symbol table

# Hint
Marker traits contain no methods and serve purely as compile-time type-level flags.

# Explanation
Marker traits contain no methods or associated types. They serve purely to convey compile-time type-level properties and guarantees (e.g. `Send`, `Sync`, `Unpin`, `Copy`) to the compiler and type system.
