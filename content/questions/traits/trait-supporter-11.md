---
id: trait-supporter-11
categorySlug: traits
title: "Super Trait Syntax"
difficulty: 2
tags: [traits, supertraits, bounds]
---

# Prompt
What does `trait SubTrait: SuperTrait` enforce on implementing types?

# Code
```rust
trait Animal { fn noise(&self); }
trait Dog: Animal { fn bark(&self); }

struct Beagle;
impl Animal for Beagle { fn noise(&self) { println!("woof"); } }
impl Dog for Beagle { fn bark(&self) { self.noise(); } }
```

# Options
- [x] A) Any type implementing `Dog` must also implement `Animal`
- [ ] B) `Dog` automatically generates default `Animal` implementations
- [ ] C) `Dog` methods override `Animal` methods in all scopes in code
- [ ] D) `Animal` is converted into a private internal submodule in code

# Hint
A supertrait bound requires types implementing the sub-trait to also implement the supertrait.

# Explanation
`trait Dog: Animal` states that `Animal` is a supertrait of `Dog`. Any concrete type implementing `Dog` is required by the compiler to also provide an `impl Animal` block.
