---
id: macro-compile-error-diagnostic-1
categorySlug: macros
title: "The compile_error! Macro"
difficulty: 1
tags: [macros, compile-error, diagnostics]
---

# Prompt
What is the role of `compile_error!("...")` in Rust macro authoring?

# Options
- [x] A) It triggers a custom compilation error with message text
- [ ] B) It generates an unrecoverable hardware segmentation fault
- [ ] C) It logs warning messages to the standard error terminal
- [ ] D) It panics at runtime when the program is first launched

# Hint
compile_error! emits a compile-time compiler error with a user-supplied message.

# Explanation
`compile_error!("message")` causes compilation to fail with the specified error message, frequently used in macro match fallback arms to signal invalid macro arguments.
