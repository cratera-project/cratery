---
id: macro-supporter-12
categorySlug: macros
title: "Literal Specifier (literal)"
difficulty: 2
tags: [macros, literal, specifiers]
---

# Prompt
Which inputs match the `$lit:literal` fragment specifier in declarative macros?

# Code
```rust
macro_rules! check_lit {
    ($lit:literal) => { println!("literal: {}", $lit); };
}
```

# Options
- [ ] A) Variable identifiers and module path expressions only within local thread memory
- [ ] B) Any expression that can be evaluated at compile time within local thread memory
- [x] C) String literals, integer constants, boolean values, and char literals
- [ ] D) Type definitions and struct field declarations only within local thread memory

# Hint
literal matches any literal token (e.g. 42, "hello", true, 'c').

# Explanation
`$lit:literal` matches literal tokens like `"string"`, `123`, `true`, `3.14`, and `'a'`. It rejects variable identifiers, complex expressions, and keyword paths.
