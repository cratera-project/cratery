---
id: macro-rules-1
categorySlug: macros
title: "Declarative Macros"
difficulty: 2
tags: [macros, declarative]
---

# Prompt
How do `macro_rules!` macros differ from functions?

# Code
```rust
macro_rules! say_hello {
    () => {
        println!("hello");
    };
}

fn main() {
    say_hello!();
}
```

# Options
- [ ] A) They are always safer than ordinary functions in runtime memory
- [ ] B) They may only expand into string literal values in code
- [x] C) They transform tokens into code before type checking
- [ ] D) They are ordinary functions invoked at runtime in code

# Hint
Macros run in the compiler, not as value-level calls.

# Explanation
`macro_rules!` expands during compilation, producing tokens that are then parsed and type-checked. Functions take runtime values. Macros are powerful but not inherently “safer.”
