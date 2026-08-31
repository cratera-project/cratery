---
id: macro-hygiene-1
categorySlug: macros
title: "Macro Hygiene"
difficulty: 2
tags: [macros, hygiene]
---

# Prompt
Why doesn't the macro's `x` clash with the caller's `x`?

# Code
```rust
macro_rules! set_x {
    () => {
        let x = 3;
    };
}

fn main() {
    let x = 1;
    set_x!();
    println!("{x}"); // prints 1
}
```

# Options
- [ ] A) Macros expand on another thread with private names
- [ ] B) Every macro-introduced binding is implicitly static
- [ ] C) It does clash; this example fails to compile
- [x] D) Hygiene keeps macro-introduced names distinct by span

# Hint
Declarative macros are hygienic for local identifiers.

# Explanation
`macro_rules!` hygiene (via spans) keeps identifiers introduced by the macro from capturing or colliding with the caller's identically named locals. The caller's `x` stays `1`. This is stronger than “just a new block,” though expansion still respects ordinary scopes too.
