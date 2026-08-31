---
id: macro-supporter-17
categorySlug: macros
title: "Stmt Fragment Specifier"
difficulty: 2
tags: [macros, stmt, statements]
---

# Prompt
What does `$s:stmt` match in macro matchers?

# Code
```rust
macro_rules! run_stmt {
    ($s:stmt) => {
        println!("running statement");
        $s
    };
}
```

# Options
- [ ] A) A string literal representing SQL database statements in runtime memory
- [ ] B) A state machine enum variant in async functions during runtime execution
- [ ] C) A static assertion evaluated at compile time during runtime execution
- [x] D) A single Rust statement (like a let binding or item declaration)

# Hint
stmt matches a single statement, which may or may not require a trailing semicolon.

# Explanation
`$s:stmt` matches a single statement (such as `let x = 10;`, `foo();`, or an item declaration), allowing macro authors to wrap or sequence statements.
