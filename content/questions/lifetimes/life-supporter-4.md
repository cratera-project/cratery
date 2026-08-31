---
id: life-supporter-4
categorySlug: lifetimes
title: "Higher-Ranked Trait Bounds (HRTB)"
difficulty: 3
tags: [lifetimes, hrtb, closures]
---

# Prompt
What does the bound for<'a> F: Fn(&'a str) -> &'a str declare?

# Code
```rust
fn apply<F>(f: F)
where
    for<'a> F: Fn(&'a str) -> &'a str,
{
    let s = String::from("test");
    println!("{}", f(&s));
}
```

# Options
- [ ] A) F must work for any lifetime chosen by the caller statically
- [ ] B) F must operate exclusively on static string references in code
- [x] C) F must work for any arbitrary lifetime chosen by the callee
- [ ] D) F is evaluated at compile-time as a constant expression in code

# Hint
for<'a> means for all possible lifetimes 'a that apply() might choose.

# Explanation
for<'a> is a Higher-Ranked Trait Bound (HRTB). It requires F to be callable with a reference of *any* lifetime 'a chosen by the implementation of apply (such as a local reference inside apply), not a single fixed caller lifetime.
