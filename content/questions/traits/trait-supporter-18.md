---
id: trait-supporter-18
categorySlug: traits
title: "Generic Type Parameter Default"
difficulty: 2
tags: [traits, generics, defaults]
---

# Prompt
What does `trait Add<Rhs = Self>` declare for the default right-hand side type?

# Code
```rust
use std::ops::Add;

struct Meters(u32);

impl Add for Meters {
    type Output = Meters;
    fn add(self, rhs: Meters) -> Self::Output {
        Meters(self.0 + rhs.0)
    }
}
```

# Options
- [ ] A) `Rhs` is forced to be a shared reference to `Self` in runtime memory
- [ ] B) `Rhs` is evaluated as a constant zero integer at runtime in code
- [ ] C) The compiler disables addition for mixed-type operations in code
- [x] D) If unspecified, `Rhs` defaults to the implementor type `Self`

# Hint
Rhs = Self defaults the generic operand to the type implementing the trait.

# Explanation
`trait Add<Rhs = Self>` uses a generic parameter default. When implementing `Add for Meters` without specifying `<Rhs>`, `Rhs` defaults to `Self` (`Meters`).
