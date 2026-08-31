---
id: ptr-supporter-28
categorySlug: pointers
title: "Pinning and Unpin Struct Derivation"
difficulty: 2
tags: [pointers, unpin, auto-trait]
---

# Prompt
When does a struct automatically implement the `Unpin` trait?

# Code
```rust
struct Data {
    x: i32,
    s: String,
}

fn check_unpin<T: Unpin>() {}

fn main() {
    check_unpin::<Data>();
}
```

# Options
- [ ] A) Only when explicitly declared with `#[derive(Unpin)]` in code
- [ ] B) Only if the struct contains no heap-allocated pointer fields
- [ ] C) Only if the struct is marked with the public export modifier
- [x] D) Automatically if all fields of the struct implement `Unpin`

# Hint
Unpin is an auto trait that is derived automatically when all fields are Unpin.

# Explanation
`Unpin` is an auto trait. If all fields in a struct implement `Unpin` (which all normal standard library types do), the struct automatically implements `Unpin`.
