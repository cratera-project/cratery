---
id: ptr-supporter-8
categorySlug: pointers
title: "Pin Projection Rules"
difficulty: 3
tags: [pointers, pin, projection]
---

# Prompt
What is "pin projection" in Rust async / Pin contexts?

# Code
```rust
// Pin<&mut Struct> -> Pin<&mut Field> for structural fields
```

# Options
- [ ] A) Allocating pinned memory buffers across distinct CPU cores within local thread memory
- [ ] B) Converting unpinned traits into dynamic vtable trait objects within local thread memory
- [ ] C) Demoting a pinned future into a synchronous blocking loop within local thread memory
- [x] D) Safely obtaining a `Pin<&mut Field>` from a `Pin<&mut Struct>` for pinned fields

# Hint
Pin projection projects a pinned reference to a struct into pinned references to its fields.

# Explanation
Pin projection is the technique of converting `Pin<&mut Struct>` into `Pin<&mut Field>` (for structurally pinned fields) or `&mut OtherField` (for unpinned fields) while upholding pinning invariants.
