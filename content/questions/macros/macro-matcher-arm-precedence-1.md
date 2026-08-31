---
id: macro-matcher-arm-precedence-1
categorySlug: macros
title: "Macro Arm Matching Order"
difficulty: 2
tags: [macros, pattern-matching, syntax]
---

# Prompt
What is printed by this macro invocation?

# Code
```rust
macro_rules! parse_token {
    ($x:expr) => {
        "expr"
    };
    ($x:literal) => {
        "literal"
    };
}

fn main() {
    println!("{}", parse_token!(42));
}
```

# Options
- [ ] A) literal because literal is more specific than expr arm
- [ ] B) Compile error due to ambiguous macro pattern match arms
- [ ] C) Compile error because integer literals are not exprs
- [x] D) expr because macro arms are matched in top-down order

# Hint
In what order does macro_rules! evaluate its pattern arms?

# Explanation
In declarative macros (`macro_rules!`), matcher arms are checked sequentially from top to bottom. The first arm that successfully parses the input tokens is expanded. Because `42` is a valid expression, `$x:expr` matches immediately and produces `"expr"`. To match more specific tokens like `$literal` or `$ident`, place those arms before broader fragment matchers like `$expr`.
