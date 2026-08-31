---
id: trait-supporter-12
categorySlug: traits
title: "Trait Associated Constants"
difficulty: 2
tags: [traits, associated-constants, const]
---

# Prompt
How do associated constants in traits participate in const evaluation?

# Code
```rust
trait Matrix {
    const ROWS: usize;
    const COLS: usize;
}

struct Square;
impl Matrix for Square {
    const ROWS: usize = 4;
    const COLS: usize = 4;
}
```

# Options
- [ ] A) They are initialized at runtime upon first trait invocation
- [x] B) They are known at compile time and can parameterize arrays
- [ ] C) They are allocated as read-only pages in heap memory in code
- [ ] D) They cannot be accessed without an instance of the struct in code

# Hint
Associated constants are evaluated at compile time.

# Explanation
Associated constants in traits are evaluated during compilation and can be used in array size expressions, const generics, and static assertions (e.g. `[u8; Square::ROWS]`).
