---
id: macro-supporter-10
categorySlug: macros
title: "TT Muncher Pattern"
difficulty: 3
tags: [macros, tt-muncher, recursive-macros]
---

# Prompt
What is a "TT muncher" in Rust declarative macro design?

# Code
```rust
macro_rules! munch {
    ($head:tt $($tail:tt)*) => {
        process_one!($head);
        munch!($($tail)*);
    };
    () => {};
}
```

# Options
- [x] A) A recursive macro that processes tokens incrementally one token tree at a time
- [ ] B) A compiler pass that eliminates unused macro expansions from binaries in runtime memory
- [ ] C) A tool that converts procedural macro token streams into C headers in runtime memory
- [ ] D) A macro that evaluates integer arithmetic expressions during lexing in runtime memory

# Hint
TT munchers match $head:tt $($tail:tt)* and recursively invoke themselves on the tail.

# Explanation
A TT muncher is a recursive macro pattern that matches one token tree `$head:tt` and the rest `$($tail:tt)*`, processes `$head`, and recursively calls itself on the remaining `$tail` until empty.
