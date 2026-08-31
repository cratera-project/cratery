---
id: ptr-box-1
categorySlug: pointers
title: "Box Ownership"
difficulty: 1
tags: [pointers, box]
---

# Prompt
What does `Box<T>` primarily provide?

# Code
```rust
let b = Box::new(5);
println!("{b}");
```

# Options
- [ ] A) Shared ownership with automatic reference counts
- [ ] B) Interior mutability checked only at runtime in code
- [ ] C) Thread-safe mutation without locking primitives
- [x] D) Exclusive heap ownership of a single `T` value

# Hint
`Box` is the simplest owning heap pointer.

# Explanation
`Box<T>` owns a heap-allocated `T` exclusively. When the `Box` is dropped, the value is dropped too. Sharing needs `Rc`/`Arc`; interior mutability needs types like `RefCell`/`Mutex`.
