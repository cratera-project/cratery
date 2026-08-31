---
id: macro-ident-1
categorySlug: macros
title: "Ident Fragment Specifier"
difficulty: 2
tags: [macros, syntax]
---

# Prompt
What can `$name:ident` match in a `macro_rules!` pattern?

# Code
```rust
macro_rules! make_const {
    ($name:ident) => {
        const $name: i32 = 1;
    };
}

make_const!(ANSWER);
```

# Options
- [x] A) An identifier token, such as `ANSWER`
- [ ] B) Any expression, including calls like `f()`
- [ ] C) Only string literals used as constant names
- [ ] D) A full type path such as `std::io::Error`

# Hint
Fragment specifiers name syntactic categories.

# Explanation
`:ident` matches a single identifier. Expressions need `:expr`, types `:ty`, paths `:path`. Using the wrong specifier is a common macro debugging dead-end for juniors.
