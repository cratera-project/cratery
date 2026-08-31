---
id: trait-orphan-1
categorySlug: traits
title: "Orphan Rule"
difficulty: 3
tags: [traits, coherence]
---

# Prompt
Which impl is allowed under the orphan rules?

# Code
```rust
// In your crate, which is legal?
// impl Display for Vec<i32> { ... }
// impl MyTrait for String { ... }
// impl Clone for i32 { ... }
// impl Debug for &str { ... }
```

# Options
- [ ] A) `impl Display for Vec<i32>` in your crate
- [x] B) `impl MyTrait for String` in your crate
- [ ] C) `impl Clone for i32` in your crate
- [ ] D) `impl Debug for &str` in your crate

# Hint
You need to own either the trait or the type.

# Explanation
You may implement a trait for a type if your crate defines the trait or the type (with some allowed coverings). `MyTrait` is yours, so `impl MyTrait for String` is fine. Implementing foreign traits for foreign types (`Display`/`Clone`/`Debug` for std types) is not.
