---
id: trait-supporter-3
categorySlug: traits
title: "Associated Type in Trait Implementation"
difficulty: 2
tags: [traits, associated-types, defaults]
---

# Prompt
What does defining `type Item;` in a trait require of implementing structs?

# Code
```rust
trait Container {
    type Item;
    fn get(&self) -> Self::Item;
}

struct ByteBox;
impl Container for ByteBox {
    type Item = u8;
    fn get(&self) -> u8 { 42 }
}
```

# Options
- [x] A) Implementors must specify the concrete `type Item` in their `impl` block
- [ ] B) All implementors are strictly forced to use 64-bit integer types in runtime memory
- [ ] C) The associated type is automatically allocated on the heap buffer in runtime memory
- [ ] D) The compiler converts the trait into an abstract virtual class in runtime memory

# Hint
Associated type defaults provide a fallback type when omitted in impl blocks.

# Explanation
Associated types require each implementing type to specify a concrete type (`type Item = ...;`) in its `impl` block.
