---
id: trait-supporter-7
categorySlug: traits
title: "Blanket Trait Implementation"
difficulty: 2
tags: [traits, blanket-impl, generics]
---

# Prompt
What is a blanket implementation in Rust?

# Code
```rust
trait Describe { fn describe(&self) -> String; }

impl<T: std::fmt::Display> Describe for T {
    fn describe(&self) -> String {
        format!("Value: {}", self)
    }
}
```

# Options
- [x] A) An implementation of a trait for any type satisfying given bounds
- [ ] B) An implementation that replaces all default trait method bodies in code
- [ ] C) A macro that stamps out implementations for every primitive in code
- [ ] D) An unsafe implementation that bypasses memory borrow checks in code

# Hint
impl<T: Bound> Trait for T implements Trait for all types satisfying the bound.

# Explanation
A blanket implementation implements a trait for any type `T` that satisfies certain trait bounds (e.g. `ToString` for any `T: Display`).
