---
id: err-panic-location-file-line-1
categorySlug: error-handling
title: "Track Caller and PanicLocation"
difficulty: 2
tags: [error-handling, track-caller, panic]
---

# Prompt
What information does `#[track_caller]` attach to panicking helper functions?

# Options
- [ ] A) It points to the memory address of the operating system
- [ ] B) It inspects heap memory pages allocated by the process
- [x] C) It provides caller source file and line number metrics
- [ ] D) It zeroes out local variables prior to stack unwinding

# Hint
#[track_caller] attributes panic locations to the caller rather than the helper definition.

# Explanation
`#[track_caller]` allows helper functions (like `unwrap()` or custom assertions) to report the caller's source code location (`file!()` and `line!()`) in panic messages.
