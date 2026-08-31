---
id: life-supporter-23
categorySlug: lifetimes
title: "Const Generic with Lifetime Bounds"
difficulty: 2
tags: [lifetimes, const-generics, structs]
---

# Prompt
Can a struct combine const generic parameters with lifetime parameters?

# Code
```rust
struct Buffer<'a, T, const N: usize> {
    slice: &'a [T; N],
}

fn main() {
    let arr = [1, 2, 3, 4];
    let _b = Buffer { slice: &arr };
}
```

# Options
- [ ] A) Yes; lifetimes and const generics operate orthogonally
- [x] B) No; const generics cannot be mixed with lifetimes here
- [ ] C) Only if N is known to be greater than 1024 bytes length
- [ ] D) Only if T implements the Copy trait on stack memory here

# Hint
Lifetime parameters and const generic parameters can be freely mixed.

# Explanation
Rust supports mixing lifetime parameters, type parameters, and const generic parameters in any struct or function declaration (e.g. struct Buffer<'a, T, const N: usize>).
