---
id: macro-supporter-15
categorySlug: macros
title: "Ty Fragment Specifier"
difficulty: 2
tags: [macros, ty, types]
---

# Prompt
What does `$t:ty` match in macro matchers?

# Code
```rust
macro_rules! make_field {
    ($name:ident : $t:ty) => {
        struct Holder { $name: $t }
    };
}
```

# Options
- [ ] A) A single primitive type keyword only (like `u32` or `bool`) in code
- [x] B) A complete Rust type specification, such as `Vec<Option<String>>`
- [ ] C) A type conversion expression implementing the `From` trait in runtime memory
- [ ] D) A trait implementation definition block `impl Trait for Type` in code

# Hint
ty matches any valid Rust type expression, including references and generics.

# Explanation
`$t:ty` matches any complete Rust type expression (e.g. `i32`, `&'a str`, `Option<Box<dyn Trait>>`, `[u8; 32]`).
