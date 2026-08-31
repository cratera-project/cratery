---
id: life-supporter-35
categorySlug: lifetimes
title: "Lifetime Bound on Struct Declaration"
difficulty: 3
tags: [lifetimes, implied-bounds, rust-2024]
---

# Prompt
In Rust 2024, why is struct RefHolder<'a, T: 'a>(&'a T); redundant?

# Code
```rust
struct RefHolder<'a, T>(&'a T);

fn main() {
    let val = 10;
    let _h = RefHolder(&val);
}
```

# Options
- [ ] A) Rust 2024 converts all struct fields into static pointers
- [x] B) T: 'a is an implied bound inferred from the field &'a T
- [ ] C) Generic structs no longer enforce lifetime bounds in rustc
- [ ] D) The compiler allocates all generic struct fields on heap

# Hint
Implied bounds automatically infer T: 'a whenever &'a T appears in a struct definition.

# Explanation
Rust features 'implied bounds': because the field &'a T requires T: 'a to be well-formed, the compiler automatically infers T: 'a without needing an explicit T: 'a bound on the struct declaration.
