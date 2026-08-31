---
id: trait-supporter-35
categorySlug: traits
title: "Trait Bound in Struct Definition vs Impl Block"
difficulty: 2
tags: [traits, idioms, bounds]
---

# Prompt
Why is it idiomatic in Rust to put trait bounds on `impl` blocks rather than struct definitions?

# Code
```rust
struct Container<T>(T);

impl<T: std::fmt::Display> Container<T> {
    fn show(&self) {
        println!("{}", self.0);
    }
}
```

# Options
- [x] A) To allow constructing `Container<T>` even when `T` does not implement `Display`
- [ ] B) Because struct definitions cannot syntactically accept where clauses in runtime memory
- [ ] C) To force the compiler to allocate generic containers on the heap in runtime memory
- [ ] D) To enable dynamic trait object conversion without vtable generation in runtime memory

# Hint
Omitting bounds on struct definitions avoids repeating bounds across every impl block and constructor.

# Explanation
Placing bounds on `impl` blocks allows constructing and manipulating `Container<T>` for any `T`, unlocking specific methods only when `T` satisfies the necessary trait bounds without restricting the struct itself.
