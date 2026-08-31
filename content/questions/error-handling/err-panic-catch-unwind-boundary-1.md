---
id: err-panic-catch-unwind-boundary-1
categorySlug: error-handling
title: "Panic Catching Limitations"
difficulty: 2
tags: [error-handling, panic, catch-unwind]
---

# Prompt
What is a critical limitation of `std::panic::catch_unwind`?

# Options
- [x] A) It cannot catch panics compiled under panic = 'abort'
- [ ] B) It runs destructors twice for all values on the stack
- [ ] C) It recovers from hardware segmentation fault signals
- [ ] D) It is only permitted inside the main entry point logic

# Hint
catch_unwind only catches unwinding panics, not aborts.

# Explanation
`catch_unwind` relies on stack unwinding; if a program or crate is compiled with `panic = "abort"`, panics immediately terminate the process without unwinding.
