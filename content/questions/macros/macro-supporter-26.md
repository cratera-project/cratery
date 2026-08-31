---
id: macro-supporter-26
categorySlug: macros
title: "Meta Fragment Specifier (meta)"
difficulty: 2
tags: [macros, meta, attributes]
---

# Prompt
What does `$m:meta` match in macro matchers?

# Code
```rust
macro_rules! apply_attr {
    (#[$m:meta] fn $name:ident() {}) => {
        #[$m] fn $name() {}
    };
}
```

# Options
- [x] A) The contents of an attribute, such as `derive(Clone)` or `inline(always)`
- [ ] B) Metadata information stored in the compiled binary header within local thread memory
- [ ] C) A trait implementation metadata table definition during runtime execution
- [ ] D) A compiler flag passed to the cargo build pipeline within local thread memory

# Hint
meta matches an attribute body (inside #[...]).

# Explanation
`$m:meta` matches the inner content of an attribute (such as `inline`, `derive(Debug)`, or `doc = "..."`), allowing macros to accept and forward attributes.
