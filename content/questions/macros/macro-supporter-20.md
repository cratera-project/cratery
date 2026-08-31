---
id: macro-supporter-20
categorySlug: macros
title: "Macro Span and Diagnostic Reporting"
difficulty: 3
tags: [macros, proc-macro, spans]
---

# Prompt
Why is preserving `Span` information in procedural macros important for error messages?

# Code
```rust
// syn::Error::new(span, "invalid syntax")
```

# Options
- [ ] A) It prevents binary executable sizes from growing during debug builds in runtime memory
- [ ] B) It accelerates LLVM code generation by skipping AST verification in runtime memory
- [x] C) It allows compiler errors to highlight the exact original source code lines
- [ ] D) It enables cross-crate trait specialization in stable Rust within local thread memory

# Hint
Span associates tokens with original file and line/column numbers for diagnostics.

# Explanation
`Span` attaches file, line, and column position information to tokens. When compiler or macro errors occur, the compiler uses the span to point precisely to the user's original code rather than macro internals.
