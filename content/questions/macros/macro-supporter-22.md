---
id: macro-supporter-22
categorySlug: macros
title: "Nested Macro Repetitions"
difficulty: 3
tags: [macros, nested-repetition, syntax]
---

# Prompt
How are nested macro repetitions `$($($x:expr),*);*` expanded in a template?

# Code
```rust
macro_rules! matrix {
    ($($($x:expr),*);*) => {
        vec![$(vec![$($x),*]),*]
    };
}
```

# Options
- [x] A) By matching inner and outer repetition levels in corresponding nested expansions
- [ ] B) By flattening all expressions into a single continuous 1D array within local thread memory
- [ ] C) By evaluating the outer loop at runtime and inner loop at compile time in runtime memory
- [ ] D) Nested repetitions are forbidden by rustc grammar specifications within local thread memory

# Hint
Each nested expansion level corresponds to a matching repetition level in the pattern.

# Explanation
When a macro pattern has multiple nested repetition levels, the expansion template must match the nesting depth so each inner repetition iterates within its corresponding outer repetition group.
