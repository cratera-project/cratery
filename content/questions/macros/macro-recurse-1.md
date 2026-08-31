---
id: macro-recurse-1
categorySlug: macros
title: "Recursive macro_rules"
difficulty: 2
tags: [macros, tt-muncher]
---

# Prompt
How can a `macro_rules!` process a list recursively?

# Code
```rust
macro_rules! count {
    () => { 0 };
    ($head:expr $(, $tail:expr)*) => {
        1 + count!($($tail),*)
    };
}
```

# Options
- [x] A) By expanding into a call with fewer tokens left
- [ ] B) By spawning a thread that re-invokes the macro
- [ ] C) By using `goto` labels inside the macro matcher
- [ ] D) Recursive macros are illegal on stable Rust today

# Hint
Peel one fragment, recurse on the rest.

# Explanation
Declarative macros may invoke themselves (or other macros) in their expansion. Classic “tt muncher” / list-peeling patterns reduce tokens each step until a base case matches. This is compile-time recursion, not runtime.
