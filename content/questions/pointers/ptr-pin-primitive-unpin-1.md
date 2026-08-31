---
id: ptr-pin-primitive-unpin-1
categorySlug: pointers
title: "Pin with Unpin Primitives"
difficulty: 2
tags: [pointers, pin, unpin]
---

# Prompt
Why does mutating `*pinned` compile without unsafe code?

# Code
```rust
use std::pin::Pin;

fn main() {
    let mut num = 42;
    let mut pinned = Pin::new(&mut num);
    *pinned = 100;
    println!("{num}");
}
```

# Options
- [x] A) i32 implements Unpin, so Pin::new and DerefMut are safe
- [ ] B) Pin only enforces memory immobility for heap types like Box
- [ ] C) Primitive integers bypass all pin guarantees in compiler
- [ ] D) DerefMut on Pin is always a safe operation for all types

# Hint
Do primitive integer types implement the Unpin auto trait?

# Explanation
`Pin` prevents values from moving in memory unless their type implements `Unpin`. Primitive types like `i32`, `f64`, `&T`, and most standard types implement the auto trait `Unpin` because they have no self-referential pointers or pinning invariants. When `T: Unpin`, `Pin::new` is safe and `Pin<&mut T>` implements `DerefMut`, allowing safe mutable access to the underlying value.
