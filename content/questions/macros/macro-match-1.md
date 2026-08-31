---
id: macro-match-1
categorySlug: macros
title: "Macro Matchers"
difficulty: 2
tags: [macros, syntax]
---

# Prompt
What can `$x:expr` match in a `macro_rules!` pattern?

# Code
```rust
macro_rules! twice {
    ($x:expr) => {
        $x + $x
    };
}
```

# Options
- [x] A) Any expression, such as `2 + 2` or `f()`
- [ ] B) Only string and byte string literal tokens
- [ ] C) Only identifiers that name local variables
- [ ] D) Only type paths used in generic arguments

# Hint
Fragment specifiers name syntactic categories.

# Explanation
`:expr` matches a Rust expression. Other common designators include `:ident`, `:ty`, `:path`, `:tt`, and `:stmt`. Literals-only or types-only need different matchers.
