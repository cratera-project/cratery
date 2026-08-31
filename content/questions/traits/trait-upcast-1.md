---
id: trait-upcast-1
categorySlug: traits
title: "Trait Object Upcasting"
difficulty: 2
tags: [traits, dyn, upcasting]
---

# Prompt
Why does `up` compile on stable Rust?

# Code
```rust
trait Super {
    fn tag(&self) -> i32;
}
trait Sub: Super {}

struct S;
impl Super for S {
    fn tag(&self) -> i32 { 7 }
}
impl Sub for S {}

fn up(x: &dyn Sub) -> &dyn Super {
    x
}
```

# Options
- [ ] A) Any `dyn Trait` coerces to every other trait
- [x] B) `dyn Sub` coerces to a supertrait object
- [ ] C) `up` clones `S` into a fresh vtable `Box`
- [ ] D) You still must write an `as_super` method

# Hint
Subtrait objects know how to view their supertraits.

# Explanation
Since Rust 1.86, a trait object can be coerced to a supertrait object (`&dyn Sub` → `&dyn Super`, and similarly for `Box`/`Arc`/raw pointers). Arbitrary unrelated traits do not coerce. An `as_super` helper is no longer required for this case.
