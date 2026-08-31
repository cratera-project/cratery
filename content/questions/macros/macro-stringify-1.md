---
id: macro-stringify-1
categorySlug: macros
title: "stringify vs concat"
difficulty: 2
tags: [macros, stringify]
---

# Prompt
What is `stringify!(1 + 2)`?

# Code
```rust
fn main() {
    assert_eq!(stringify!(1 + 2), "1 + 2");
    assert_eq!(concat!("a", "b"), "ab");
}
```

# Options
- [ ] A) The string `"3"` after constant evaluation
- [x] B) The token text `"1 + 2"`, not the computed sum
- [ ] C) A runtime `format!` of the expression’s value
- [ ] D) Invalid; `stringify!` only accepts identifiers

# Hint
One macro pastes tokens; the other pastes string literals.

# Explanation
`stringify!` turns its tokens into a string literal without evaluating them, so `1 + 2` stays `"1 + 2"`. `concat!` concatenates string (and some other) literals at compile time (`"ab"`). Neither runs at runtime like `format!`.
