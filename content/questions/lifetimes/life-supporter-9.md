---
id: life-supporter-9
categorySlug: lifetimes
title: "Self-Referential Structs in Safe Rust"
difficulty: 3
tags: [lifetimes, self-referential, safety]
---

# Prompt
Why does safe Rust reject a struct holding a field and a reference to that field?

# Code
```rust
// struct SelfRef { data: String, ptr: &??? str }
```

# Options
- [ ] A) Safe Rust forbids having more than one pointer in any struct in code
- [ ] B) String buffers cannot be addressed by references inside structs in code
- [ ] C) The compiler cannot generate Default implementations for them in code
- [x] D) Moving the struct would invalidate the internal reference pointer

# Hint
When a struct moves in memory, its stack address changes, making internal pointers dangling.

# Explanation
In Rust, moving a struct copies its bytes to a new location. If a struct contained a reference to one of its own fields, moving the struct would leave that reference pointing to the old, invalid memory location.
