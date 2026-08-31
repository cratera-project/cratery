---
id: trait-impl-trait-return-pos-1
categorySlug: traits
title: "Return Position Impl Trait (RPIT)"
difficulty: 2
tags: [traits, impl-trait, rpit]
---

# Prompt
What are the static dispatch properties of `fn produce() -> impl Trait`?

# Options
- [ ] A) The return type is dynamically dispatched via fat vtable
- [x] B) The concrete type is unnameable but statically resolved
- [ ] C) The returned value is boxed into an allocated heap node
- [ ] D) Callers can choose whichever return type they want for fn

# Hint
impl Trait in return position is existential and monomorphized statically without heap allocation.

# Explanation
`impl Trait` in return position hides the concrete type from caller signatures while monomorphizing statically with zero runtime vtable overhead.
