---
id: err-from-residual-branch-1
categorySlug: error-handling
title: "Question Mark Automatic Error Conversion"
difficulty: 2
tags: [error-handling, question-mark, from]
---

# Prompt
How does `?` convert an error of type `E1` to the function return error type `E2`?

# Options
- [ ] A) It allocates a secondary thread stack to handle errors
- [ ] B) It disables destructor execution for early return path
- [x] C) It maps the early-return error into the caller err type
- [ ] D) It converts the return value into a raw integer exit code

# Hint
The ? operator automatically invokes From::from on the error value.

# Explanation
The `?` operator calls `From::from(error)` to implicitly convert the error from the callee into the caller function's error return type.
