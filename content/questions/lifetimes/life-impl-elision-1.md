---
id: life-impl-elision-1
categorySlug: lifetimes
title: "Impl Block Lifetimes"
difficulty: 2
tags: [lifetimes, impl]
---

# Prompt
Why does this `impl` need `<'a>` on the impl header?

# Code
```rust
struct Wrap<'a> {
    s: &'a str,
}

impl<'a> Wrap<'a> {
    fn get(&self) -> &'a str {
        self.s
    }
}
```

# Options
- [ ] A) Impl blocks cannot mention structs that borrow data
- [x] B) The lifetime on `Wrap` must be declared to use it
- [ ] C) `'a` is only legal inside free functions, not impls
- [ ] D) Methods that return `&str` always need `'static`

# Hint
Generic parameters are introduced before they are used.

# Explanation
`Wrap` is generic over `'a`, so `impl` must introduce that parameter (`impl<'a> Wrap<'a>`) before naming the type. Elision can still apply to method inputs like `&self`, but the struct’s lifetime parameter remains explicit.
