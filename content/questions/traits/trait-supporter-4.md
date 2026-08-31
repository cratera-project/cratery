---
id: trait-supporter-4
categorySlug: traits
title: "Disambiguation with Fully Qualified Syntax"
difficulty: 2
tags: [traits, syntax, disambiguation]
---

# Prompt
How do you call `TraitA::ping` when both `TraitA` and `TraitB` define `ping`?

# Code
```rust
trait TraitA { fn ping(&self); }
trait TraitB { fn ping(&self); }

struct Worker;
impl TraitA for Worker { fn ping(&self) { println!("A"); } }
impl TraitB for Worker { fn ping(&self) { println!("B"); } }

fn main() {
    let w = Worker;
    <Worker as TraitA>::ping(&w);
}
```

# Options
- [ ] A) By renaming the method in the struct definition module in code
- [x] B) Using fully qualified syntax `<Worker as TraitA>::ping(&w)`
- [ ] C) By casting `w` with `unsafe { std::mem::transmute(w) }` in code
- [ ] D) Using runtime dynamic dispatch `(&w as &dyn TraitA).ping()`

# Hint
Fully qualified syntax <Type as Trait>::method unambiguously specifies the trait.

# Explanation
When multiple implemented traits have overlapping method names, Fully Qualified Syntax `<Type as Trait>::method(...)` unambiguously tells the compiler which trait method to call.
