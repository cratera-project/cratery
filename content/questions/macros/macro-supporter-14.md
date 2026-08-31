---
id: macro-supporter-14
categorySlug: macros
title: "Path Fragment Specifier"
difficulty: 2
tags: [macros, path, modules]
---

# Prompt
What does `$p:path` match in declarative macros?

# Code
```rust
macro_rules! print_type {
    ($p:path) => { println!("path used"); };
}
```

# Options
- [x] A) A module or type path like `std::collections::HashMap`
- [ ] B) A filesystem directory path string like `"/usr/bin"` in code
- [ ] C) A trait bound constraint like `T: Send + Sync` during runtime execution
- [ ] D) An unsafe raw pointer address expression during runtime execution

# Hint
path matches qualified item paths separated by double colons ::.

# Explanation
`$p:path` matches item and type paths such as `crate::module::Item` or `std::sync::Arc`.
