---
id: macro-paste-1
categorySlug: macros
title: "Macro Expansion Order"
difficulty: 2
tags: [macros, compilation]
---

# Prompt
When are `macro_rules!` invocations expanded relative to types?

# Code
```rust
macro_rules! make_add {
    ($a:expr, $b:expr) => {
        $a + $b
    };
}

fn main() {
    let n = make_add!(1, 2);
}
```

# Options
- [ ] A) After monomorphization, like a generic function body
- [ ] B) At runtime, immediately before the `+` operator runs
- [x] C) During compilation, before type-checking expanded code
- [ ] D) Only in debug builds; release inlines them away early

# Hint
Expansion feeds the parser/resolver; it is not a runtime step.

# Explanation
Macro expansion happens at compile time as part of turning the crate into an AST that can be resolved and type-checked. By the time types are checked, `make_add!(1, 2)` is already `1 + 2`.
