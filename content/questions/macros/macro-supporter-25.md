---
id: macro-supporter-25
categorySlug: macros
title: "Macro Use Directive (#[macro_use])"
difficulty: 2
tags: [macros, macro_use, modules]
---

# Prompt
What does `#[macro_use]` on a `mod` declaration do?

# Code
```rust
#[macro_use]
mod helpers {
    macro_rules! greet { () => { println!("hi"); }; }
}

fn main() {
    greet!();
}
```

# Options
- [ ] A) Exports all module functions into the global C ABI namespace in runtime memory
- [ ] B) Forces the compiler to inline all function calls in that module in runtime memory
- [ ] C) Converts all module constants into thread-local variables in runtime memory
- [x] D) Brings macros defined in that module into the enclosing module's scope

# Hint
#[macro_use] pushes macros from a module up into the parent scope.

# Explanation
Applying `#[macro_use]` to a module brings all `macro_rules!` macros defined within that module into the parent module's scope, making them available without explicit path qualification.
