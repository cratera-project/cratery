---
id: ptr-supporter-35
categorySlug: pointers
title: "UnsafeCell::get Pointer Mutability"
difficulty: 2
tags: [pointers, unsafe-cell, get]
---

# Prompt
What pointer type is returned by `UnsafeCell::get(&self)`?

# Code
```rust
use std::cell::UnsafeCell;

fn main() {
    let cell = UnsafeCell::new(42);
    let ptr: *mut i32 = cell.get();
    unsafe { *ptr += 1; }
    println!("{}", unsafe { *cell.get() });
}
```

# Options
- [ ] A) An exclusive reference `&mut T`
- [ ] B) A shared immutable pointer `*const T`
- [x] C) A raw mutable pointer `*mut T`
- [ ] D) A non-null pointer wrapper `NonNull<T>`

# Hint
UnsafeCell::get takes &self and returns a *mut T raw pointer.

# Explanation
`UnsafeCell::get(&self)` takes an immutable shared reference `&self` and returns a raw mutable pointer `*mut T` to the wrapped value, providing the foundational primitive for all interior mutability in Rust.
