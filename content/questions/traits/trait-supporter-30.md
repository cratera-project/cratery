---
id: trait-supporter-30
categorySlug: traits
title: "Dyn Trait Size at Compile Time"
difficulty: 2
tags: [traits, dyn, unsized]
---

# Prompt
What is `std::mem::size_of::<dyn Trait>()`?

# Code
```rust
// trait Trait {}
// let size = std::mem::size_of::<dyn Trait>(); // compile error
```

# Options
- [ ] A) Exactly 16 bytes representing data and vtable pointers within local thread memory
- [ ] B) 8 bytes representing a single function pointer address within local thread memory
- [ ] C) 0 bytes because traits carry no inherent memory footprint in runtime memory
- [x] D) It fails to compile because `dyn Trait` is dynamically sized (`?Sized`)

# Hint
dyn Trait itself is unsized; size_of requires Sized types.

# Explanation
`dyn Trait` is a Dynamically Sized Type (DST) with unknown size at compile time. It can only be used behind pointers like `&dyn Trait` (which is 16 bytes). Calling `size_of::<dyn Trait>()` fails to compile because `size_of` requires `T: Sized`.
