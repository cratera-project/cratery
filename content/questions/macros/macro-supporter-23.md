---
id: macro-supporter-23
categorySlug: macros
title: "Vis Fragment Specifier"
difficulty: 2
tags: [macros, vis, visibility]
---

# Prompt
What does `$v:vis` match in declarative macros?

# Code
```rust
macro_rules! make_struct {
    ($v:vis struct $name:ident) => {
        $v struct $name;
    };
}
```

# Options
- [ ] A) A visual studio compiler configuration parameter during runtime execution in code
- [x] B) An optional visibility modifier (like `pub`, `pub(crate)`, or empty private)
- [ ] C) A variable scope lifetime identifier during runtime execution in runtime memory
- [ ] D) A virtual function dispatch keyword attribute during runtime execution in code

# Hint
vis matches visibility modifiers including pub, pub(crate), or nothing.

# Explanation
`$v:vis` matches visibility qualifiers (e.g. `pub`, `pub(crate)`, `pub(super)`, or nothing for private items), allowing macros to preserve the caller's intended visibility on generated items.
