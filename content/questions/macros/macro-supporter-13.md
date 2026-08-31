---
id: macro-supporter-13
categorySlug: macros
title: "Ident Fragment Specifier"
difficulty: 1
tags: [macros, ident, tokens]
---

# Prompt
What does `$id:ident` match in a macro matcher?

# Code
```rust
macro_rules! make_fn {
    ($name:ident) => {
        fn $name() { println!("called"); }
    };
}
```

# Options
- [ ] A) A full path including module separators like `std::vec::Vec` in runtime memory
- [ ] B) A string literal inside double quotes like `"my_name"` in runtime memory
- [ ] C) Any arbitrary block enclosed in curly braces `{ ... }` in runtime memory
- [x] D) A single identifier or keyword token name (like `foo` or `MyStruct`)

# Hint
ident matches a single valid Rust identifier name.

# Explanation
`$id:ident` matches a single identifier name (variable name, function name, struct name). To match paths with `::`, use `$p:path`.
