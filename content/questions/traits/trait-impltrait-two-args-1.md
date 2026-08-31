---
id: trait-impltrait-two-args-1
categorySlug: traits
title: "`impl Trait` Parameters"
difficulty: 3
tags: [traits, impl-trait, bounds]
---

# Prompt
What is true about these parameters?

# Code
```rust
pub fn notify(item1: &impl Summary, item2: &impl Summary) {}
```

# Options
- [x] A) Each arg may be a different `Summary` type
- [ ] B) Both arguments must share one concrete type
- [ ] C) Both arguments must be `dyn Summary` objects
- [ ] D) This form works only for stdlib traits

# Hint
Each `impl Trait` argument is an independent anonymous generic.

# Explanation
Each `impl Summary` in argument position is its own type parameter. The two arguments may therefore be different concrete types, as long as both implement `Summary`.
