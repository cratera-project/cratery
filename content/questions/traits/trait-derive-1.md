---
id: trait-derive-1
categorySlug: traits
title: "Derive Attribute"
difficulty: 1
tags: [traits, derive]
---

# Prompt
What does `#[derive(Debug)]` do?

# Code
```rust
#[derive(Debug)]
struct Point { x: i32, y: i32 }
```

# Options
- [ ] A) Mark every field as mutable for debugging sessions
- [ ] B) Disable optimizations so values stay inspectable
- [x] C) Generate an `impl Debug for Point` via derive
- [ ] D) Turn on compiler logging for this type only

# Hint
`derive` is a macro that writes a trait impl for you.

# Explanation
`#[derive(Debug)]` runs a derive macro that generates an `impl Debug for Point`, enabling formatting with `{:?}`. It does not change mutability or compiler logging.
