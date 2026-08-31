---
id: life-supporter-12
categorySlug: lifetimes
title: "Reference Trait Object Lifetime Bound"
difficulty: 2
tags: [lifetimes, trait-objects, references]
---

# Prompt
What is the default lifetime bound for &'a dyn Trait?

# Code
```rust
trait Plugin {}
fn run<'a>(p: &'a dyn Plugin) {
    let _ = p;
}
```

# Options
- [ ] A) &'a (dyn Plugin + 'static)
- [ ] B) &'a (dyn Plugin + '_)
- [x] C) &'a (dyn Plugin + 'a)
- [ ] D) &'a (dyn Plugin + 'fn)

# Hint
Trait objects behind references default to the lifetime of the reference.

# Explanation
Unlike Box<dyn Trait> which defaults to 'static, a trait object behind a reference &'a dyn Trait defaults to &'a (dyn Trait + 'a).
