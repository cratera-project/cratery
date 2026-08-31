---
id: life-supporter-17
categorySlug: lifetimes
title: "Fn Trait Lifetime Higher Ranking"
difficulty: 2
tags: [lifetimes, hrtb, fn-traits]
---

# Prompt
Why does fn take_fn<F: Fn(&i32)>(f: F) compile without lifetime generics on take_fn?

# Code
```rust
fn take_fn<F: Fn(&i32)>(f: F) {
    let x = 10;
    f(&x);
}
```

# Options
- [ ] A) Local variables inside functions default to static lifetimes
- [ ] B) Closures clone all reference arguments automatically in code
- [ ] C) Fn trait parameters are evaluated in constant compiler passes
- [x] D) Fn(&i32) is sugar for higher-ranked for<'a> Fn(&'a i32)

# Hint
Elided lifetimes in Fn trait bounds desugar to higher-ranked for<'a> bounds.

# Explanation
In trait bounds, Fn(&i32) automatically desugars to for<'a> Fn(&'a i32). This allows take_fn to pass references created within its own local stack frame to f.
