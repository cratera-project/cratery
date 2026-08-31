---
id: macro-eager-1
categorySlug: macros
title: "Macro Call Site Expansion"
difficulty: 2
tags: [macros, scoping]
---

# Prompt
Where do `macro_rules!` names resolve from by default?

# Code
```rust
mod inner {
    macro_rules! m { () => { 1 }; }
    pub fn f() -> i32 { m!() }
}

// m!(); // not visible here without export/use tricks
```

# Options
- [ ] A) They behave exactly like `pub fn` items for visibility
- [ ] B) They are always global once defined anywhere in a crate
- [x] C) They are scoped to the module that defines them
- [ ] D) They only expand inside `unsafe` blocks by default

# Hint
`#[macro_export]` and `use` change the story.

# Explanation
Without `#[macro_export]`, a `macro_rules!` macro is visible in the defining module (and children, depending on definition order/legacy rules). It is not automatically crate-wide like a casual mental model of “macros are global.”
