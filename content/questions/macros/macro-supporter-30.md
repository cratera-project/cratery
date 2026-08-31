---
id: macro-supporter-30
categorySlug: macros
title: "Macro Rules Push-Down Accumulator"
difficulty: 3
tags: [macros, push-down, design-patterns]
---

# Prompt
What is the "push-down accumulation" pattern in `macro_rules!`?

# Code
```rust
macro_rules! collect_items {
    (@accum [$($acc:ident)*] $next:ident $($rest:ident)*) => {
        collect_items!(@accum [$($acc)* $next] $($rest)*);
    };
    (@accum [$($acc:ident)*]) => {
        println!("collected: {:?}", stringify!($($acc)*));
    };
}
```

# Options
- [x] A) Passing accumulated state through recursive macro invocations using internal `@` arms
- [ ] B) Pushing values into an OS environment variable table during compilation in runtime memory
- [ ] C) Accumulating CPU register allocations for inline assembly blocks within local thread memory
- [ ] D) Combining multiple crates into a single static library binary within local thread memory

# Hint
Push-down accumulation collects parsed tokens inside a bracketed state buffer across recursive calls.

# Explanation
Push-down accumulation is a declarative macro technique where intermediate state is collected into a helper bracketed buffer (like `[$($acc)*]`) and passed down through recursive macro calls until matching a terminal base case.
