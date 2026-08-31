---
id: trait-coherence-covered-type-1
categorySlug: traits
title: "Covered Types in Trait Coherence"
difficulty: 3
tags: [traits, coherence, orphan-rule]
---

# Prompt
What defines a "covered type" under Rust orphan rules for `impl<T> ForeignTrait for MyType<T>`?

# Options
- [ ] A) Generic parameters are covered only if bounded by Sized
- [ ] B) Covered types disable all blanket trait implementations
- [x] C) A type is covered if it appears inside a local type ctor
- [ ] D) Covered types must be exported publicly from root module

# Hint
A type parameter is covered if it appears within a local type constructor (e.g. Vec<T> in your crate).

# Explanation
Under RFC 2451 coherence rules, a type parameter `T` is "covered" if it appears as an argument to a local type constructor (like `MyStruct<T>`), allowing trait impls on foreign traits.
