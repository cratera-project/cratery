---
id: macro-supporter-4
categorySlug: macros
title: "Follow-Set Ambiguity Rules"
difficulty: 3
tags: [macros, follow-set, parser]
---

# Prompt
Why cannot a `$p:pat` fragment specifier be immediately followed by arbitrary tokens in a macro matcher?

# Code
```rust
macro_rules! test_pat {
    ($p:pat => $e:expr) => { ... };
}
```

# Options
- [ ] A) Because pattern matching is disabled inside declarative macro bodies within local thread memory
- [ ] B) Because pattern fragments must always be wrapped in parentheses within local thread memory
- [x] C) To prevent grammar ambiguity and allow future syntax extensions without breaking macros
- [ ] D) To force procedural macros to handle all pattern transformations within local thread memory

# Hint
Follow-set restrictions guarantee the macro parser can unambiguously determine when a fragment ends.

# Explanation
Rust enforces follow-set rules: certain fragment specifiers (like `pat`, `expr`, `ty`) can only be followed by specific tokens (e.g. `=>`, `,`, `=`) so the parser can reliably detect the boundary of the fragment without lookahead ambiguity.
