---
id: macro-matcher-pat-param-1
categorySlug: macros
title: "pat_param vs pat Fragment"
difficulty: 3
tags: [macros, patterns, follow-set]
---

# Prompt
Why is `$p:pat_param` used instead of `$p:pat` in the first arm?

# Code
```rust
macro_rules! match_pat {
    ($p:pat_param | $tail:pat) => { "or_pattern" };
    ($p:pat) => { "single_pattern" };
}

fn main() {
    println!("{}", match_pat!(1 | 2));
}
```

# Options
- [ ] A) $p:pat can only match struct patterns with named fields
- [ ] B) $p:pat is completely deprecated and removed in Rust 2024
- [x] C) $p:pat includes top-level | and cannot be followed by |
- [ ] D) $p:pat_param converts patterns into runtime expressions

# Hint
Consider how or-patterns (A | B) affect macro follow-set rules.

# Explanation
In Rust 2021 and 2024 editions, the `$pat` fragment specifier matches top-level or-patterns (e.g. `A | B`). Because of this, `$pat` cannot be followed by a vertical bar `|` due to ambiguity in the macro parser follow-set rules. The `$pat_param` fragment specifier matches patterns excluding top-level or-patterns, allowing `|` to legally follow it in macro matchers.
