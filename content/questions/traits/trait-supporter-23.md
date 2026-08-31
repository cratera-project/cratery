---
id: trait-supporter-23
categorySlug: traits
title: "FnOnce vs FnMut vs Fn Inheritance"
difficulty: 2
tags: [traits, fn-traits, hierarchy]
---

# Prompt
What is the inheritance relationship among `Fn`, `FnMut`, and `FnOnce`?

# Code
```rust
fn invoke_fn<F: Fn()>(f: F) {
    f();
}
```

# Options
- [x] A) `Fn` is a sub-trait of `FnMut`, which is a sub-trait of `FnOnce`
- [ ] B) `FnOnce` is a sub-trait of `FnMut`, which is a sub-trait of `Fn` during execution
- [ ] C) All three traits are independent and mutually exclusive in runtime memory
- [ ] D) `FnMut` is the supertrait of both `Fn` and `FnOnce` in runtime memory

# Hint
Any closure that can be called repeatedly without mutation (Fn) can also be called as FnMut and FnOnce.

# Explanation
The hierarchy is: `pub trait Fn(): FnMut()`, and `pub trait FnMut(): FnOnce()`. Therefore, any closure implementing `Fn` also implements `FnMut` and `FnOnce`.
