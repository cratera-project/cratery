---
id: trait-object-unsized-1
categorySlug: traits
title: "Why `Box<dyn Trait>`?"
difficulty: 3
tags: [traits, dyn, sized]
---

# Prompt
Why doesn’t this work, and what’s the usual fix?

# Code
```rust
struct Screen {
    components: Vec<dyn Draw>,
}
```

# Options
- [ ] A) Traits can’t appear in structs; switch to an enum
- [x] B) `dyn Draw` is unsized; use `Vec<Box<dyn Draw>>`
- [ ] C) `Vec` requires `Copy`; bound `Draw: Copy` instead
- [ ] D) Write `Vec<impl Draw>`; sizedness follows automatically

# Hint
`Vec` elements must have a known size at compile time.

# Explanation
`dyn Draw` is a DST (dynamically sized). Put it behind a pointer such as `Box<dyn Draw>` (or `&dyn Draw`) so `Vec` has a sized element type.
