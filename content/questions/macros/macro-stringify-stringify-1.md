---
id: macro-stringify-stringify-1
categorySlug: macros
title: "Token Stringification with stringify!"
difficulty: 1
tags: [macros, stringify]
---

# Prompt
What does the built-in `stringify!(...)` macro produce?

# Options
- [ ] A) It evaluates variables and formats their debug values
- [ ] B) It converts expressions into runtime JSON string maps
- [ ] C) It parses arbitrary strings into executable bytecode
- [x] D) It yields the literal source tokens as a &str literal

# Hint
stringify! captures the exact tokens as written in code without evaluating them.

# Explanation
`stringify!(...)` takes tokens at compile time and converts their exact textual representation into a static `&'static str` literal without evaluating expressions.
