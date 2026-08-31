---
id: err-error-source-backtrace-1
categorySlug: error-handling
title: "std::error::Error::source Method"
difficulty: 2
tags: [error-handling, error-trait, source]
---

# Prompt
What is the purpose of the `std::error::Error::source(&self)` method in Rust?

# Options
- [ ] A) It replaces the error type with an unrecoverable abort
- [x] B) It returns an optional reference to the lower-level error
- [ ] C) It allocates an isolated thread storage key on stack
- [ ] D) It panics if the error chain exceeds four iterations

# Hint
source returns Option<&(dyn Error + 'static)> representing the underlying cause.

# Explanation
`Error::source()` returns a reference to the lower-level error that caused the current error, enabling chaining of errors for rich diagnostic reporting.
