---
id: trait-associated-type-1
categorySlug: traits
title: "Associated Types"
difficulty: 2
tags: [traits, associated-types]
---

# Prompt
What does `type Item` mean in this trait?

# Code
```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

# Options
- [x] A) A type alias chosen once per implementing type
- [ ] B) A second generic parameter callers must always pass
- [ ] C) A runtime tag identifying the iterator’s element
- [ ] D) A lifetime tied to every call to `next`

# Hint
Associated types are outputs of the impl, not inputs at each call.

# Explanation
An associated type is a type placeholder fixed by each `impl`. For `Iterator`, `Item` is the element type produced by that iterator. Callers use `I::Item` rather than adding another type parameter on every use.
