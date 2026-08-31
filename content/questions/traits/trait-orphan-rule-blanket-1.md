---
id: trait-orphan-rule-blanket-1
categorySlug: traits
title: "Trait Orphan Rule Fundamentals"
difficulty: 2
tags: [traits, orphan-rule, coherence]
---

# Prompt
What core constraint does the Rust orphan rule enforce for `impl<T> Trait for Type`?

# Options
- [x] A) Either the trait or the implementing type must be local
- [ ] B) Foreign traits can only be implemented inside std crate
- [ ] C) Blanket implementations must specify unsafe extern C fn
- [ ] D) The orphan rule only applies when compiling nightly tests

# Hint
You cannot implement a foreign trait for a foreign type in a third-party crate.

# Explanation
The orphan rule (trait coherence) requires that either the trait or the type being implemented must be defined in the current crate, preventing conflicting external implementations.
