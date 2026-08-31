---
id: trait-auto-traits-negative-impl-1
categorySlug: traits
title: "Negative Trait Implementations"
difficulty: 2
tags: [traits, auto-traits, negative-impl]
---

# Prompt
What does a negative trait implementation (`impl !Send for MyType`) declare?

# Options
- [x] A) It explicitly opts a type out of an automatic auto trait
- [ ] B) It converts the trait into an unsafe procedural attribute
- [ ] C) It forces the compiler to inline all calls to that trait
- [ ] D) It generates a runtime panic when the type is constructed

# Hint
Negative implementations opt out of auto traits like Send or Sync.

# Explanation
Negative trait implementations (`impl !Trait`) explicitly opt a type out of an auto trait (like `Send` or `Sync`), preventing the compiler from automatically deriving it.
