---
id: life-trait-object-default-bound-1
categorySlug: lifetimes
title: "Trait Object Lifetime Elision Defaults"
difficulty: 2
tags: [lifetimes, trait-objects, elision]
---

# Prompt
What lifetime bound does `&'a dyn Trait` infer by default when not explicitly specified?

# Options
- [ ] A) The trait object lifetime defaults to static in all scopes
- [x] B) The lifetime defaults to 'a from the enclosing reference
- [ ] C) The trait object must be accompanied by an explicit lifetime
- [ ] D) The compiler rejects lifetime elision on dyn trait objects

# Hint
&'a dyn Trait defaults to &'a (dyn Trait + 'a).

# Explanation
For references to trait objects `&'a dyn Trait`, the default object lifetime bound is inferred as `'a` (i.e. `&'a (dyn Trait + 'a)`). For `Box<dyn Trait>`, it defaults to `'static`.
