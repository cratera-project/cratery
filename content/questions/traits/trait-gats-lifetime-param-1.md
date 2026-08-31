---
id: trait-gats-lifetime-param-1
categorySlug: traits
title: "Generic Associated Types (GATs)"
difficulty: 3
tags: [traits, gats]
---

# Prompt
What fundamental capability do Generic Associated Types (GATs) introduce?

# Options
- [ ] A) Associated types must only depend on concrete type args
- [ ] B) GATs require allocating the returned items on heap page
- [x] C) Associated types can carry their own generic parameters
- [ ] D) GATs disable trait object creation for the entire crate

# Hint
GATs allow associated types like `type Item<'a>;`.

# Explanation
GATs allow associated types to declare generic type or lifetime parameters (e.g. `type Item<'a>;`), enabling lending iterators and generic collection abstractions.
