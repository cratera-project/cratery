---
id: trait-supporter-6
categorySlug: traits
title: "Orphan Rule and Local Types"
difficulty: 3
tags: [traits, orphan-rules, coherence]
---

# Prompt
Under Rust's orphan rules, when can you implement a trait for a type?

# Code
```rust
// impl ForeignTrait for ForeignType { ... } // Error
```

# Options
- [ ] A) Only when both the trait and type are declared in the same file during execution
- [ ] B) Whenever the trait is marked with the public export attribute in code
- [ ] C) Only if the type implements the core Sized and Sync traits in code
- [x] D) When either the trait or the type is local to the current crate

# Hint
At least one of the trait or type must be defined in the current crate.

# Explanation
The orphan rule ensures coherence: you can implement trait `T` for type `U` only if either `T` or `U` is defined in your local crate, preventing conflicting implementations across independent crates.
