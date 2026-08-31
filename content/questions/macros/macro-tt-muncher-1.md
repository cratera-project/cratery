---
id: macro-tt-muncher-1
categorySlug: macros
title: "Token Tree Fragments"
difficulty: 3
tags: [macros, tokens]
---

# Prompt
What does the `$($t:tt)*` pattern commonly allow?

# Code
```rust
macro_rules! as_is {
    ( $($t:tt)* ) => { $($t)* };
}
```

# Options
- [ ] A) Only comma-separated lists of type names
- [x] B) Almost any token sequence, forwarded unchanged
- [ ] C) Only items that type-check before expansion
- [ ] D) Only expressions already wrapped in braces

# Hint
`:tt` is the most general fragment specifier.

# Explanation
A `tt` (token tree) is a single token or a delimited group. `$($t:tt)*` matches an arbitrary token sequence, which is why it is used for pass-through and recursive “tt muncher” macros. It does not require the tokens to type-check first.
