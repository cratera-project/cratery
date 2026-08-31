---
id: macro-stmt-1
categorySlug: macros
title: "Stmt Fragment Specifier"
difficulty: 2
tags: [macros, syntax]
---

# Prompt
What does `$s:stmt` match?

# Code
```rust
macro_rules! with_stmt {
    ($s:stmt) => {
        { $s }
    };
}
```

# Options
- [ ] A) Only type names used in generic argument lists
- [ ] B) Only literal tokens such as `1` or `"hi"`
- [ ] C) Only patterns on the left of a `match` arm
- [x] D) A single statement, such as `let x = 1;`

# Hint
Statements vs expressions are different fragments.

# Explanation
`:stmt` matches one statement. Juniors often confuse it with `:expr`. A `let` binding is a statement; many expressions need `:expr` (and semicolon rules differ in expansion).
