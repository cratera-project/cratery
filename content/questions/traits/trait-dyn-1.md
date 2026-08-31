---
id: trait-dyn-1
categorySlug: traits
title: "Trait Objects"
difficulty: 3
tags: [traits, dyn]
---

# Prompt
Why use `Vec<Box<dyn Animal>>` here?

# Code
```rust
let animals: Vec<Box<dyn Animal>> = vec![
    Box::new(Dog {}),
    Box::new(Cat {}),
];
```

# Options
- [ ] A) So the vector itself becomes immutable forever after
- [ ] B) Because `Vec` can only hold pointer-sized element types
- [ ] C) To grow the vector without ever needing reallocation
- [x] D) To store different `Animal` implementors together

# Hint
`Vec` needs one element layout; trait objects unify that layout.

# Explanation
`Dog` and `Cat` have different sizes. Boxing them as `dyn Animal` gives a uniform fat-pointer element type so one `Vec` can hold mixed implementors behind dynamic dispatch.
