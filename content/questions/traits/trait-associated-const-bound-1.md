---
id: trait-associated-const-bound-1
categorySlug: traits
title: "Associated Constants in Traits"
difficulty: 2
tags: [traits, associated-const]
---

# Prompt
What guarantee is required when declaring `const ID: u32;` inside a trait?

# Options
- [ ] A) Associated constants cannot be used inside where bounds
- [ ] B) The constant must be evaluated dynamically by runtime
- [ ] C) Implementing types must mark all associated items pub
- [x] D) Every implementing type must define the constant value

# Hint
Associated constants without defaults must be provided by every implementor.

# Explanation
An associated constant without a default value must be defined as a compile-time constant by every type implementing the trait.
