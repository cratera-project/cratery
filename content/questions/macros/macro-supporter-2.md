---
id: macro-supporter-2
categorySlug: macros
title: "Macro Hygiene for Local Bindings"
difficulty: 3
tags: [macros, hygiene, syntax-context]
---

# Prompt
Why can a macro define a local variable `let x = 10;` without conflicting with outer variables named `x`?

# Code
```rust
macro_rules! define_local {
    () => {
        let x = 10;
        println!("{x}");
    };
}

fn main() {
    let x = 99;
    define_local!();
    assert_eq!(x, 99);
}
```

# Options
- [x] A) Declarative macros use syntax context hygiene to isolate generated identifier names
- [ ] B) Macros execute in a separate temporary OS thread with its own stack frame in runtime memory
- [ ] C) The compiler moves outer variables into static program heap memory within local thread memory
- [ ] D) Variables defined inside macros are automatically promoted to constants in runtime memory

# Hint
Macro hygiene assigns unique syntax context colors to macro-generated identifiers.

# Explanation
Rust declarative macros (`macro_rules!`) are hygienic for local variables: identifiers created inside the macro expansion carry a distinct syntax context and cannot accidentally capture or shadow variables in the caller's scope.
