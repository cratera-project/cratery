---
id: life-elision-method-1
categorySlug: lifetimes
title: "Method Elision Rule"
difficulty: 3
tags: [lifetimes, elision, methods]
---

# Prompt
Why can this method return `&str` without explicit lifetimes?

# Code
```rust
struct Wrap<'a> { s: &'a str }

impl<'a> Wrap<'a> {
    fn get(&self) -> &str { self.s }
}
```

# Options
- [x] A) Elision ties the output lifetime to `&self`
- [ ] B) Output `&str` values are treated as owned data
- [ ] C) Structs with lifetimes skip borrow checking
- [ ] D) Impl blocks default all references to `'static`

# Hint
Methods with `&self` get a special elision rule.

# Explanation
If there is a `&self`/`&mut self` receiver, elision uses the receiver’s lifetime for elided output lifetimes. The returned `&str` is treated as borrowed from `self` (and thus constrained by that borrow), which fits common accessors.
