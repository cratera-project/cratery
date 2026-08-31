---
id: trait-def-1
categorySlug: traits
title: "Trait Definition"
difficulty: 1
tags: [traits, impl]
---

# Prompt
What is the primary role of a `trait` in Rust?

# Code
```rust
trait Summary {
    fn summarize(&self) -> String;
}
```

# Options
- [x] A) Describe shared behavior types can implement
- [ ] B) Define a class hierarchy with inheritance of fields
- [ ] C) Limit variable scope inside a single module in code
- [ ] D) Expand macros into concrete method bodies in code

# Hint
Think “interface for behavior,” not OOP inheritance.

# Explanation
A trait declares method signatures (and optional defaults) that describe shared behavior. Types `impl` the trait to provide those methods. Traits do not define class hierarchies or field inheritance.
