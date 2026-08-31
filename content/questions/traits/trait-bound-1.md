---
id: trait-bound-1
categorySlug: traits
title: "Trait Bounds"
difficulty: 2
tags: [traits, bounds]
---

# Prompt
What does this bound require of `T`?

# Code
```rust
pub fn notify<T: Display + Clone>(item: &T) { /* ... */ }
```

# Options
- [ ] A) `T` must implement `Display` or else `Clone`
- [ ] B) `T` must convert into both `Display` and `Clone`
- [ ] C) `T` must return `Display` and `Clone` values
- [x] D) `T` must implement both `Display` and `Clone`

# Hint
In bounds, `+` means “and,” not “or.”

# Explanation
`T: Display + Clone` means `T` must implement every listed trait. The caller must supply a type that is both `Display` and `Clone`.
