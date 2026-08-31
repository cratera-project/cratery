---
id: trait-supertrait-dyn-upcast-1
categorySlug: traits
title: "Trait Object Upcasting Coercion"
difficulty: 3
tags: [traits, dyn, upcasting]
---

# Prompt
How does Rust support upcasting from `dyn SubTrait` to `dyn SuperTrait`?

# Options
- [ ] A) The trait object must be reconstructed using Box::new
- [x] B) Rust allows direct coercion from Subtrait to Supertrait
- [ ] C) Upcasting dyn trait objects requires an unsafe transmute
- [ ] D) The target supertrait must omit all associated constants

# Hint
Trait object upcasting allows converting dyn Sub to dyn Super directly.

# Explanation
Rust provides trait upcasting coercion, allowing references to `dyn SubTrait` to be implicitly coerced to `dyn SuperTrait` via embedded supertrait vtables.
